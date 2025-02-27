const net = require('net');
const Movie = require('../models/movie');
const MovieMapping = require('../models/mappingMovies');
const UserMapping = require('../models/mappingUsers');
const mongoose = require('mongoose');
const Category = require('../models/category');

// Persistent TCP client connection
let client;

const sendTcpRequest = (command) => {
    return new Promise((resolve, reject) => {
        if (!client) {
            client = new net.Socket();
            client.connect(12345, 'tcp-server', () => {
                console.log('Connected to C++ server');
            });

            client.on('error', (err) => {
                console.error('TCP connection error:', err);
                client.destroy();
                client = null;
                reject(err);
            });

            client.on('close', () => {
                console.log('Connection to C++ server closed');
                client = null;
            });
        }

        client.write(command + '\n');

        // Collect response
        let dataBuffer = '';
        client.on('data', (data) => {
            dataBuffer += data.toString();
            if (dataBuffer.endsWith('\n')) {
                resolve(dataBuffer.trim());
                dataBuffer = '';
            }
        });
    });
};

// Get paginated movies by genre
exports.getMoviesByGenre = async (req, res) => {
    try {
        const { genre, page = 1, limit = 20 } = req.query;

        const query = genre ? { genre } : {};
        const movies = await Movie.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a new movie
exports.addMovie = async (req, res) => {
    try {
        const { title, genre, year, description, streamingUrl, thumbnail, promoted } = req.body;
        console.log("Received Movie Data:", req.body);
        // Find or create the category
        let category = await Category.findOne({ name: genre });
        if (!category) {
            category = new Category({ name: genre, promoted: false });
            await category.save();
        }

        // Create the movie
        const movie = new Movie({
            title,
            genre,
            year,
            description,
            streamingUrl,
            thumbnail,
            promoted,
            category: category._id
        });
        const savedMovie = await movie.save();
        if (!title || !genre || !description) {
            console.error("Missing fields in request");
            return res.status(400).json({ error: "Missing required fields" });
        }
        // Add the movie to the category
        category.movies.push(savedMovie._id);
        await category.save();

        // Check if a mapping already exists
        const existingMapping = await MovieMapping.findById(savedMovie._id);
        if (!existingMapping) {
            // Generate a new integer ID
            const newIntId = await MovieMapping.countDocuments() + 1;
            // Save the mapping
            await MovieMapping.create({
                _id: savedMovie._id.toString(),
                intId: newIntId
            });
        }

        res.status(201).json(savedMovie);
    } catch (error) {
        console.error("Error saving movie:", error);
        res.status(400).json({ error: error.message });
    }
};

// Add watched movie (integrated with C++ server)
exports.addWatchedMovie = async (req, res) => {
    const movieId = req.params.id;
    const userId = req.body.userId;

    console.log('Received userId:', userId);  // Debug log

    try {
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Step 1: Get the integer IDs from the mapping collections
        const movieMapping = await MovieMapping.findById(movieId);
        const userMapping = await UserMapping.findById(userId.toString());
        
        // Check if both mappings exist
        if (!movieMapping ||!userMapping) {
            return res.status(404).json({ error: 'Movie or user not found in mapping.' });
        }

        const intMovieId = movieMapping.intId;
        const intUserId = userMapping.intId;

        // Step 2: Send the request to the C++ server
        const response = await sendTcpRequest(`POST ${intUserId} ${intMovieId}`);
        console.log('TCP Response:', response); // <-- Add this for debugging

        if (response.startsWith('201')) {
            // Movie successfully added to watched list
            res.status(201).json({ message: 'Movie added to watched list' });
        } else {
            // Invalid response from C++ server
            res.status(400).json({ message: 'Invalid request' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get movie by ID
exports.getMovieById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Received Movie ID:", id);  // Debugging log

        // Ensure ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error("Invalid MongoDB ObjectId format:", id);
            return res.status(400).json({ error: "Invalid movie ID format" });
        }

        // Query the database
        const movie = await Movie.findById(id);
        console.log("Movie Found:", movie); // Log the movie data

        if (!movie) {
            console.error("Movie not found in the database:", id);
            return res.status(404).json({ error: "Movie not found" });
        }

        res.status(200).json(movie);
    } catch (error) {
        console.error("Error fetching movie by ID:", error);
        res.status(500).json({ error: error.message });
    }
};

// Update movie by ID
exports.updateMovieById = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        res.status(200).json(movie);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete movie by ID
exports.deleteMovieById = async (req, res) => {
    try {
        // Step 1: Get the movie ID from the request
        const movieId = req.params.id;

        // Step 2: Find the movie to get its category before deleting it
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        // Step 3: Remove the movie from the database
        await Movie.findByIdAndDelete(movieId);

        // Step 4: Remove the movie from the corresponding category's movies array
        if (movie.category) {
            await Category.findByIdAndUpdate(movie.category, {
                $pull: { movies: movieId }
            });
        }

        // Step 5: Delete the corresponding mapping if it exists
        await MovieMapping.findByIdAndDelete(movieId);

        // Step 6: Respond with a successful deletion message
        res.status(204).send(); // No content to return
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get recommendations (integrated with C++ server)
exports.getRecommendations = async (req, res) => {
    const movieId = req.params.id;      // MongoDB ObjectId (as a string) of the base movie
    // Retrieve the userId from the query parameters 
    const userId = req.query.userId;      

    try {
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const movieMapping = await MovieMapping.findById(movieId);
        const userMapping = await UserMapping.findById(userId);

        if (!userMapping || !movieMapping) {
            return res.status(404).json({ message: "Mapping not found" });
        }

        const intMovieId = movieMapping.intId;
        const intUserId = userMapping.intId;

        const response = await sendTcpRequest(`GET ${intUserId} ${intMovieId}`);
        console.log("Raw TCP response:", response);

        if (!response.startsWith("200")) {
            return res.status(404).json({ message: "Recommendations not found" });
        }

        const lines = response.split("\n");
        console.log("[DEBUG] Full TCP response:", response);

        if (lines.length < 2) {
            return res.status(500).json({ message: "TCP server returned incomplete data" });
        }

        const intIDsString = lines[1] ? lines[1].trim() : null;
        if (!intIDsString) {
            console.warn("No recommended IDs returned from TCP server.");
            return res.status(404).json({ message: "No recommended IDs returned" });
        }

        const intIDs = intIDsString.split(" ").map(Number).filter(num => !isNaN(num));
        const recommendedMoviesData = [];

        for (const intID of intIDs) {
            const recMapping = await MovieMapping.findOne({ intId: intID });
            if (recMapping) {
                const recMovie = await Movie.findById(recMapping._id);
                if (recMovie) {
                    recommendedMoviesData.push(recMovie);
                }
            }
        }

        return res.status(200).json({ recommendedMovies: recommendedMoviesData });

    } catch (error) {
        console.error("Error in getRecommendations:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getWatchedMovies = async (req, res) => {
    try {
        const userId = req.params.userId; // The user's Mongo ObjectId
        // 1) find userMapping => intUserId
        const userMapping = await UserMapping.findById(userId);
        if (!userMapping) {
            return res.status(404).json({ error: 'User not found in mapping.' });
        }

        const intUserId = userMapping.intId;

        // 2) Call "GETALL <intUserId>" on C++ server
        const response = await sendTcpRequest(`GETALL ${intUserId}`);
        console.log("[DEBUG getWatchedMovies] raw TCP response:", response);

        if (!response.startsWith('200')) {
            return res.status(404).json({ error: 'No watched movies found or server returned error.' });
        }

        // Expect "200 Ok\n15 30 7\n"
        const lines = response.split('\n');
        if (lines.length < 2) {
            return res.status(500).json({ error: 'TCP server returned incomplete data' });
        }

        const intIDsString = lines[1].trim(); // e.g. "15 30 7"
        if (!intIDsString) {
            // Means user has no movies
            return res.status(200).json({ watchedMovies: [] });
        }

        const movieIDs = intIDsString.split(' '); // => ["15","30","7"]
        // 3) For each integer ID => find corresponding Mongo movie
        const watchedMoviesData = [];
        for (const strID of movieIDs) {
            const iID = parseInt(strID, 10);
            if (isNaN(iID)) continue;

            // findOne => e.g. { _id: "mongoId", intId: iID }
            const mapDoc = await MovieMapping.findOne({ intId: iID });
            if (mapDoc) {
                const movieDoc = await Movie.findById(mapDoc._id);
                if (movieDoc) {
                    watchedMoviesData.push(movieDoc);
                }
            }
        }

        // 4) Return array of full movie docs
        return res.status(200).json({ watchedMovies: watchedMoviesData });
    } catch (err) {
        console.error("Error in getWatchedMovies:", err);
        return res.status(500).json({ error: err.message });
    }
};

exports.searchMovies = async (req, res) => {
    try {
        let { query } = req.params;
        console.log("Received search query:", query); // Debugging log

        // Validate query
        if (!query || query.trim().length === 0) {
            return res.status(400).json({ error: "Search query cannot be empty." });
        }

        query = query.trim();

        // Ensure case-insensitive search
        const movies = await Movie.find({
            $or: [
                { title: new RegExp(query, "i") },
                { genre: new RegExp(query, "i") }
            ]
        });

        if (movies.length === 0) {
            console.log("No movies found for query:", query);
        }

        res.status(200).json(movies);
    } catch (error) {
        console.error("Error fetching search results:", error);
        res.status(500).json({ error: "Server error while searching movies" });
    }
};

// Fetch all movies
exports.fetchMovies = async (req, res) => {
    try {
        const movies = await Movie.find({}); // Fetch all movies

        if (!movies || movies.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(movies); // Send movies as a JSON response
    } catch (error) {
        res.status(500).json({ error: "Error fetching movies: " + error.message });
    }
};

// Watch a movie by ID (streaming or redirecting to a URL)
exports.watchMovie = async (req, res) => {
    const { id } = req.params;

    try {
        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        // Assuming the movie object has a streamingUrl property
        if (!movie.streamingUrl) {
            return res.status(404).send('No streaming URL found for this movie');
        }

        // Redirect to the movie streaming URL
        res.redirect(movie.streamingUrl);
    } catch (err) {
        res.status(500).send('Error retrieving movie');
    }
};
exports.getRandomMovie = async (req, res) => {
  try {
    // 1) Count how many movies exist
    const count = await Movie.countDocuments();
    if (count === 0) {
      return res.status(404).json({ error: 'No movies available.' });
    }

    // 2) Use the aggregation pipeline with $sample
    const [randomMovie] = await Movie.aggregate([{ $sample: { size: 1 } }]);
    if (!randomMovie) {
      return res.status(404).json({ error: 'No random movie found.' });
    }

    return res.status(200).json(randomMovie);
  } catch (error) {
    console.error('Error fetching random movie:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};