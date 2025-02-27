const mongoose = require('mongoose');
const Movie = require('../models/movie');
const User = require('../models/User');
const MovieMapping = require('../models/mappingMovies');
const UserMapping = require('../models/mappingUsers');

// MongoDB connection string with fallback
const uri = process.env.CONNECTION_STRING || 'mongodb://127.0.0.1:27017/movieDB';

async function populateMappings() {
    try {
        // Connect to MongoDB
        await mongoose.connect(uri);

        
        // Ensure connection is established before querying
        mongoose.connection.on('open', async () => {
            console.log('MongoDB connected successfully.');

            // Populate movies_mapping
            const movies = await Movie.find();
            const moviePromises = movies.map(async (movie, index) => {
                const existingMapping = await MovieMapping.findById(movie._id);
                if (!existingMapping) {
                    await MovieMapping.create({
                        _id: movie._id.toString(),
                        intId: index + 1,
                    });
                }
            });
            await Promise.all(moviePromises);

            // Populate users_mapping
            const users = await User.find();
            const userPromises = users.map(async (user, index) => {
                const existingMapping = await UserMapping.findById(user._id);
                if (!existingMapping) {
                    await UserMapping.create({
                        _id: user._id.toString(),
                        intId: index + 1,
                    });
                }
            });
            await Promise.all(userPromises);

            console.log('Mappings populated successfully.');
        });
    } catch (err) {
        console.error('Error populating mappings:', err);
    } finally {
        // Disconnect from MongoDB
        mongoose.disconnect();
    }
}

module.exports = populateMappings;