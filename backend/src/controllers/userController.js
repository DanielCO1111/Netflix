const User = require('../models/User'); // Ensure the User model is imported
const UserMapping = require('../models/mappingUsers');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); 


/*exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        // Validate and convert the ID to an ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        // Find the user by ID in the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the user's name and email
        const { name, email } = user;
        res.status(200).json({ name, email });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};*/


exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { first_name, last_name, username, role } = user;
        res.status(200).json({ first_name, last_name, username, role });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete user by ID
exports.deleteUserById = async (req, res) => {
    try {
        // Step 1: Get the user ID from the request
        const userId = req.params.id;

        // Step 2: Check if a mapping exists for the user
        const userMapping = await UserMapping.findById(userId);
        if (!userMapping) {
            return res.status(404).json({ error: 'User not found in mapping.' });
        }

        // Step 3: Find and delete the user by ID
        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Step 4: Delete the corresponding mapping if it exists
        await UserMapping.findByIdAndDelete(userId);

        // Step 5: Respond with a successful deletion message
        res.status(204).send(); // No content to return
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};