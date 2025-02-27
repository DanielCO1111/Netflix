const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category'); // Ensure this path is correct
const { authenticate, authorize } = require('../middlewares/auth');

// Define the routes
router.route('/categories')
    .get(categoryController.getCategories) // Ensure getCategories is properly exported
     // Admin-Protected Routes
    .post(authenticate, authorize(['Admin']), categoryController.createCategory); // Ensure createCategory is properly exported

router.route('/categories/:id')
    .get(categoryController.getCategory) // Ensure getCategory is properly exported
     // Admin-Protected Routes
    .put(authenticate, authorize(['Admin']), categoryController.updateCategory) // Ensure updateCategory is properly exported
    .delete(authenticate, authorize(['Admin']), categoryController.deleteCategory); // Ensure deleteCategory is properly exported

module.exports = router;






