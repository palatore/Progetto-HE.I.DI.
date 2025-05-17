const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authControllers');
const { registerValidator, loginValidator, validate } = require('../validators/authValidators');

// Registrazione
router.post('/register', registerValidator, validate, AuthController.register);

// Login
router.post('/login', loginValidator, validate, AuthController.login);

// Logout
//router.post('/logout', AuthController.logout);

module.exports = router;