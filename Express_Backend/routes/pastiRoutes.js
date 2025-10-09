const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken.js');
const PastiControllers = require('../controllers/pastiControllers');

router.get('/alimenti', PastiControllers.getAlimenti);
router.get('/pasti', PastiControllers.getPasti);
router.get('/alimenti_pasti', PastiControllers.getAlimentiPasti);
router.get('/dettagliPasto/:id_pasto', authenticateToken, PastiControllers.getDettagliPasto);
router.get('/pastiUtente', authenticateToken, PastiControllers.getPastiUtente);
router.post('/checkPasto', authenticateToken, PastiControllers.checkPasto);
router.post('/creaPasti', authenticateToken, PastiControllers.creaPasti);
router.post('/riempiPasto', authenticateToken, PastiControllers.riempiPasto);
router.delete('/eliminaPasto/:id_pasto', authenticateToken, PastiControllers.eliminaPasto);

module.exports = router;