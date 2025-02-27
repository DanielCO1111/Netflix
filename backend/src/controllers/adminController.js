const Movie = require('../models/movie');
const Category = require('../models/category');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json({ success: true, movies });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Category name is required' });

        const category = new Category({ name });
        await category.save();
        res.status(201).json({ message: 'Category added successfully', category });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};