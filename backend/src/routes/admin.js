const express = require('express');
const router = express.Router();
const User = require('../models/User');
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middlewares/auth');

// Admin registration route
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, username, password } = req.body;

        if (!first_name || !last_name || !username || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if the username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const admin = new User({ first_name, last_name, username, password, role: 'Admin' });
        await admin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Admin-protected routes
router.get('/users', authenticate, authorize(['Admin']), adminController.getAllUsers);
router.get('/movies', authenticate, authorize(['Admin']), adminController.getAllMovies);
router.post('/categories', authenticate, authorize(['Admin']), adminController.addCategory);

module.exports = router;