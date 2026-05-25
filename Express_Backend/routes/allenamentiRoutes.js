const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken.js');
const AllenamentiControllers = require('../controllers/allenamentiControllers.js');

router.get('/esercizi', AllenamentiControllers.getEsercizi);
router.get('/allenamenti', AllenamentiControllers.getAllenamenti);
router.get('/eserciziAllenamento', AllenamentiControllers.getEserciziAllenamenti);
router.get('/dettagliAllenamento/:id_allenamento', authenticateToken, AllenamentiControllers.getDettagliAllenamento);
router.get('/allenamentiUtente', authenticateToken, AllenamentiControllers.getAllenamentiUtente);
router.post('/checkAllenamento', authenticateToken, AllenamentiControllers.checkAllenamento);
router.post('/creaAllenamenti', authenticateToken, AllenamentiControllers.creaAllenamenti);
router.post('/riempiAllenamento', authenticateToken, AllenamentiControllers.riempiAllenamento);
router.delete('/eliminaAllenamento/:id_allenamento', authenticateToken, AllenamentiControllers.eliminaAllenamento);

module.exports = router;