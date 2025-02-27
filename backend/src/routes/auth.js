const express = require('express');
const authController = require('../controllers/auth');
const { authenticate, authorize } = require('../middlewares/auth');
const validateId = require('../middlewares/validateID');
const userController = require('../controllers/userController');
const tokenController = require('../controllers/tokenController');

const router = express.Router();

router.post('/users', authController.register);
router.post('/login', authController.login);
router.post('/tokens', tokenController.postToken);

// Route for Normal Users
router.get('/users/self/:id', authenticate, userController.getUserById);

// Route for Admins
router.get('/users/:id', authenticate, authorize(['Admin']), validateId, userController.getUserById);

// Admin registration route
router.post('/admin/register', authController.register);
// Admin-Protected Routes
router.get('/users/:id', authenticate, authorize(['Admin']), validateId, userController.getUserById);
router.put('/users/:id', authenticate, authorize(['Admin']), validateId, userController.updateUserById);
router.delete('/users/:id', authenticate, authorize(['Admin']), validateId, userController.deleteUserById);

module.exports = router;