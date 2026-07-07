const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken.js');
const BachecaControllers = require('../controllers/bachecaControllers');
const Bacheca = require('../models/bacheca.js');

router.get('/pastiBacheca', authenticateToken, BachecaControllers.getPastiBacheca);
router.get('/allenamentiBacheca', authenticateToken, BachecaControllers.getAllenamentiBacheca);
router.get('/singolaAttivita', authenticateToken, BachecaControllers.getSingolaAttivitaBacheca);
router.get('/votiAttivita', authenticateToken, BachecaControllers.getVotiAttivita);
router.post('/condividiAttivita', authenticateToken, BachecaControllers.condividiAttivita);
router.post('/votaAttivita', authenticateToken, BachecaControllers.votaAttivita);

module.exports = router;