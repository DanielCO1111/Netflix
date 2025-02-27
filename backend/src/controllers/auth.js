const User = require('../models/User'); // Ensure the User model is imported
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); 
const UserMapping = require('../models/mappingUsers');
const multer = require('multer');
const path = require('path');


// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../../uploads'); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// Updated register route to handle image upload
exports.register = [
  upload.single('profileImage'), // Middleware to handle single file upload
  async (req, res) => {
    try {
      const { first_name, last_name, username, password, role } = req.body;

      if (!first_name || !last_name || !username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Check if the username is already in use
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already in use' });
      }

      // Save the new user, including the uploaded image path
      const user = new User({
        first_name,
        last_name,
        username,
        password,
        role: role || 'User', // Default to 'User' if no role is provided
        profileImage: req.file ? req.file.filename : null, // Save image filename or null
      });
      await user.save();

      // Check if there's already a userMapping doc for that user
      const existingMapping = await UserMapping.findById(user._id.toString());
      if (!existingMapping) {
        // Generate a new integer ID
        const newIntId = await UserMapping.countDocuments() + 1;
        // Create the mapping doc
        await UserMapping.create({
          _id: user._id.toString(),
          intId: newIntId
        });
      }

      res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
      console.error('Error registering user:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
];

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user || !user.validatePassword(password)) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Include role and userId in the payload
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.SECRET_KEY || 'your_secret_key',
      { expiresIn: '1h' }
    );

    // Return both the token and the userId
    res.status(200).json({ token, userId: user._id });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};