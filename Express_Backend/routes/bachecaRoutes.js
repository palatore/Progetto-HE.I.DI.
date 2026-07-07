const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken.js');
const BachecaControllers = require('../controllers/bachecaControllers');
const Bacheca = require('../models/bacheca.js');

router.get('/votiAttivita', authenticateToken, BachecaControllers.getVotiAttivita);
router.post('/votaAttivita', authenticateToken, BachecaControllers.votaAttivita);

module.exports = router;