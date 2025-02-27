// Import the Express framework to create a server
const express = require('express');
// Import Mongoose to interact with the MongoDB database
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path'); // Import the path module
// Import category routes to handle category-related endpoints
const categories = require('./routes/category');
const authRoutes = require('./routes/auth');
const moviesRoutes = require('./routes/movies');
// Import models
const Movie = require('./models/movie');
const User = require('./models/User');
const Category = require('./models/category');
const UserMapping = require('./models/mappingUsers.js');
const MovieMapping = require('./models/mappingMovies');

// Load environment variables from the `.env.local` file located in the `config` directory
require('dotenv').config({ path: './config/.env.local' });

const app = express();
const connectionString = process.env.CONNECTION_STRING || 'mongodb://mongodb:27017/movieDB';

// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Verify the connection string exists
if (!connectionString) {
  console.error('Error: MongoDB connection string is not defined.');
  process.exit(1);
}

// Connect to MongoDB using the connection string from the environment variables
mongoose
  .connect(connectionString)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Check if the database is empty and restore data if needed
    await restoreDatabaseFromJSON();
  })
  .catch((error) => {
    console.error('Connection error:', error);
    process.exit(1); // Exit the process if MongoDB fails to connect
  });

// Middleware: Parse incoming JSON payloads in requests and make them available in `req.body`
app.use(express.json());
app.use(cors());

// Disable ETag headers, which are used for caching but not needed in this application
app.disable('etag');

// Middleware: Remove the `Date` header from all responses to prevent including server timestamps
app.use((req, res, next) => {
  res.removeHeader('Date'); // Explicitly remove the Date header
  next(); // Continue to the next middleware or route handler
});

// Mount routes
app.use('/api', authRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api', categories);

// Define a default route
app.get('/', (req, res) =>
  res.json({
    message: 'Welcome to the API',
    endpoints: {
      auth: '/api',
      movies: '/api/movies',
    },
  })
);

// Restore database from JSON if empty
async function restoreDatabaseFromJSON() {
  try {
    const hasMovies = await Movie.countDocuments() > 0;
    const hasUsers = await User.countDocuments() > 0;
    const hasCategories = await Category.countDocuments() > 0;
    const hasUserMappings = await UserMapping.countDocuments() > 0;
    const hasMovieMappings = await MovieMapping.countDocuments() > 0;

    if (!hasMovies || !hasUsers || !hasCategories || !hasUserMappings || !hasMovieMappings) {
      console.log('No existing data found. Importing from JSON...');
      const backupDir = path.join(__dirname, 'data', 'backup');
      
      const findBackupFile = (name) => {
        const file = fs.readdirSync(backupDir).find(file => file.includes(name));
        return file ? path.join(backupDir, file) : null;
      };
      
      const moviesFile = findBackupFile('movies.json');
      const usersFile = findBackupFile('users.json');
      const categoriesFile = findBackupFile('categories.json');
      const userMappingsFile = findBackupFile('usermappings.json');
      const movieMappingsFile = findBackupFile('moviemappings.json');
      
      if (moviesFile && usersFile && categoriesFile && userMappingsFile && movieMappingsFile) {
        try {
          const parseJSONFile = (filePath) => {
            return JSON.parse(fs.readFileSync(filePath, 'utf-8'), (key, value) => {
                if (key === '_id' || key === 'category') return new mongoose.Types.ObjectId(value.$oid || value);
                if (key === 'createdAt' && value.$date) return new Date(value.$date);
                if (key === 'movies' && Array.isArray(value)) {
                    return value.map(v => new mongoose.Types.ObjectId(v.$oid || v));
                }
                return value;
            });
          };
        
          const moviesData = parseJSONFile(moviesFile);
          const usersData = parseJSONFile(usersFile);
          const categoriesData = parseJSONFile(categoriesFile);
          const userMappingsData = parseJSONFile(userMappingsFile);
          const movieMappingsData = parseJSONFile(movieMappingsFile);
          
          console.log(`Movies Data: ${moviesData.length} records`);
          console.log(`Users Data: ${usersData.length} records`);
          console.log(`Categories Data: ${categoriesData.length} records`);
          console.log(`UserMappings Data: ${userMappingsData.length} records`);
          console.log(`MovieMappings Data: ${movieMappingsData.length} records`);
          
          await Movie.insertMany(moviesData);
          await User.insertMany(usersData);
          await Category.insertMany(categoriesData);
          await UserMapping.insertMany(userMappingsData);
          await MovieMapping.insertMany(movieMappingsData);
          
          console.log('Database restored from JSON.');
        } catch (err) {
          console.error('Error parsing JSON files:', err);
        }
      } else {
        console.error('Error: One or more backup files are missing.');
      }
    } else {
      console.log('Database already contains data. No import needed.');
    }
  } catch (error) {
    console.error('Error importing JSON data:', error);
  }
}

// Start the server and listen for incoming requests
const PORT = process.env.PORT || 3000; // Use the port from environment variables or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log the server's running status
});