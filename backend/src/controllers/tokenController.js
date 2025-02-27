const User = require('../models/User'); // User model is imported
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); 

/*exports.postToken = async (req, res) => {
    try {
        const { name, password } = req.body;

        // Ensure both name and password are provided
        if (!name || !password) {
            return res.status(400).json({ error: 'Name and password are required' });
        }

        // Find the user by name
        const user = await User.findOne({ name });
        if (!user || !user.validatePassword(password)) {
            return res.status(404).json({ error: 'User is not registered' });
        }

        // Return the user's ID if registered
        res.status(200).json({ id: user._id });

    } catch (err) {
        console.error('Error checking user registration:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};*/


exports.postToken = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await User.findOne({ username });
        if (!user || !user.validatePassword(password)) {
            return res.status(404).json({ error: 'User is not registered' });
        }

        res.status(200).json({ id: user._id });
    } catch (err) {
        console.error('Error checking user registration:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};