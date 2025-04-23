const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');  // Correctly import userController

// Routes for user authentication
router.post('/signup', userController.signup); // Ensure 'signup' is a function
router.post('/login', userController.login);   // Ensure 'login' is a function

module.exports = router;
