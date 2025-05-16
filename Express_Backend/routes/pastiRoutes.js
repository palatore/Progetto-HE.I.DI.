const express = require('express');
const router = express.Router();
const PastiControllers = require('../controllers/pastiControllers');

router.get('/alimenti', PastiControllers.getAlimenti);
router.get('/pasti', PastiControllers.getPasti);

module.exports = router;