const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authControllers');
const { registerValidator, loginValidator, validate } = require('../validators/authValidators');

router.post('/register', registerValidator, validate, AuthController.register);
router.post('/login', loginValidator, validate, AuthController.login);
router.get('/ruoliProfessionista', AuthController.getRuoliProfessionisti);
module.exports = router;