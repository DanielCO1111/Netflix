const mongoose = require('mongoose');
const Movie = require('../models/movie');
const Category = require('../models/category');
const User = require('../models/User');
const MovieMapping = require('../models/mappingMovies');
const UserMapping = require('../models/mappingUsers');

// Use your real connection string from environment or fallback
const uri = process.env.CONNECTION_STRING || 'mongodb://127.0.0.1:27017/movieDB';

const updateExistingData = async () => {
  try {
    // 1) Connect to MongoDB
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected successfully.');
    /** Movies */
    const movies = await Movie.find();
    console.log(`Found ${movies.length} movies.`);

    for (const movie of movies) {
      // A) Find or create the category
      let category = await Category.findOne({ name: movie.genre });
      if (!category) {
        category = new Category({ name: movie.genre, promoted: false });
        await category.save();
        console.log(`Created new category: ${category.name}`);
      }

      // B) Build 'updates' for missing fields
      const updates = {};
      if (!movie.category) {
        updates.category = category._id;
      }
      if (!movie.thumbnail) {
        updates.thumbnail = 'https://path.to/default/icon.png';
      }
      if (typeof movie.promoted === 'undefined') {
        updates.promoted = false;
      }
      if (!movie.streamingUrl) {
        updates.streamingUrl = 'https://path.to/default/video';
      }

      // C) If updates needed, apply them
      if (Object.keys(updates).length > 0) {
        await Movie.updateOne({ _id: movie._id }, { $set: updates });
        console.log(`Updated movie: ${movie.title} with new fields.`);
      }

      // D) Add the movie to the category if not already included
      if (!category.movies.includes(movie._id)) {
        category.movies.push(movie._id);
        await category.save();
        console.log(`Added movie: ${movie.title} to category: ${category.name}`);
      }

      // E) (Optional) Ensure older movies have a MovieMapping
      const existingMovieMapping = await MovieMapping.findById(movie._id.toString());
      if (!existingMovieMapping) {
        const newIntId = await MovieMapping.countDocuments() + 1;
        await MovieMapping.create({
          _id: movie._id.toString(),
          intId: newIntId
        });
        console.log(`MovieMapping created for movie ${movie.title} => intId = ${newIntId}`);
      }
    }
    /** Users */
    const users = await User.find();
    console.log(`Found ${users.length} users.`);

    for (const user of users) {
      // A) Build 'userUpdates' for missing fields
      const userUpdates = {};

      // 1) Update an old 'name' field
      if ((!user.first_name || !user.last_name)) {
        // If there's an old 'user.name' or 'user.email' we can parse them
        userUpdates.first_name = user.first_name || 'Unknown';
        userUpdates.last_name = user.last_name || 'User';
      }

      // 2) If no username but possibly leftover 'email'
      if (!user.username) {
        // fallback to something
        userUpdates.username = user.username || `user${Date.now()}`;
      }

      // 3) If no role
      if (!user.role) {
        userUpdates.role = 'User';
      }

      // 4) If no profile image
      if (!user.profileImage) {
        userUpdates.profileImage = 'https://path.to/default/profile.png';
      }

      // B) Apply updates and remove old fields 'name', 'email' if they exist
      if (Object.keys(userUpdates).length > 0) {
        await User.updateOne(
          { _id: user._id },
          {
            $set: userUpdates,
            $unset: { name: "", email: "" } // remove old fields if they exist
          }
        );
        console.log(`Updated user: ${user.username || user._id} with new fields/removed old fields.`);
      }

      // C) Ensure older users have a UserMapping
      const existingUserMapping = await UserMapping.findById(user._id.toString());
      if (!existingUserMapping) {
        // create a new intID for them
        const newIntId = await UserMapping.countDocuments() + 1;
        await UserMapping.create({
          _id: user._id.toString(),
          intId: newIntId
        });
        console.log(`UserMapping created for user ${user.username || user._id} => intId = ${newIntId}`);
      }
    }

    console.log('Data update complete.');
  } catch (error) {
    console.error('Error updating data:', error);
  } finally {
    // 5) Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

updateExistingData();