const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');
const { authenticate, authorize } = require('../middlewares/auth');
// Middleware to validate ObjectId
const validateId = require('../middlewares/validateID');

// Public Routes
router.get('/', moviesController.fetchMovies); 
router.get('/randomMovie', moviesController.getRandomMovie); 
router.get('/search/:query', moviesController.searchMovies); 
router.get('/:id', validateId, moviesController.getMovieById); 
router.get('/:id/watch', validateId, moviesController.watchMovie);
router.get('/', moviesController.getMoviesByGenre);

// Authenticated User Routes
router.get('/users/:userId/watched',authenticate, validateId, moviesController.getWatchedMovies);
router.get('/:id/recommend', authenticate, validateId, moviesController.getRecommendations);
router.post('/:id/recommend',authenticate, validateId, moviesController.addWatchedMovie);

// Admin-Protected Routes
router.post('/', authenticate, authorize(['Admin']), moviesController.addMovie);
router.put('/:id', authenticate, authorize(['Admin']), validateId, moviesController.updateMovieById);
router.delete('/:id', authenticate, authorize(['Admin']), validateId, moviesController.deleteMovieById);

module.exports = router;