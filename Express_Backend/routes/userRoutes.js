const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken.js');
const UserControllers = require('../controllers/userControllers');

router.get('/utenti', UserControllers.getUsers);
router.get('/utente/:id_utente', authenticateToken, UserControllers.getUtenteById);
router.get('/ruoli/:ruolo', UserControllers.getUtentiByRuolo);

module.exports = router;