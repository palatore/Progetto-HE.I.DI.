const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken.js');
const PastiControllers = require('../controllers/pastiControllers');

router.get('/alimenti', PastiControllers.getAlimenti);
router.get('/alimento/:id_alimento', PastiControllers.getAlimentoById);
router.get('/pasti', PastiControllers.getPasti);
router.get('/alimenti_pasti', PastiControllers.getAlimentiPasti);
router.get('/dettagliPasto/:id_pasto', authenticateToken, PastiControllers.getDettagliPasto);
router.get('/pasto/:id_pasto', authenticateToken, PastiControllers.getPastoById);
router.get('/pastiUtente', authenticateToken, PastiControllers.getPastiUtente);
router.get('/pastiProgrammati', authenticateToken, PastiControllers.getPastiProgrammati);
router.post('/checkPasto', authenticateToken, PastiControllers.checkPasto);
router.post('/creaPasti', authenticateToken, PastiControllers.creaPasti);
router.post('/riempiPasto', authenticateToken, PastiControllers.riempiPasto);
router.post('/modificaPasto', authenticateToken, PastiControllers.modificaPasto);
router.post('/programmaPasto', authenticateToken, PastiControllers.programmaPasto);
router.post('/clonaPasto', authenticateToken, PastiControllers.clonaPasto);
router.delete('/disdiciPasto', authenticateToken, PastiControllers.disdiciPasto);
router.delete('/eliminaPasto/:id_pasto', authenticateToken, PastiControllers.eliminaPasto);

module.exports = router;