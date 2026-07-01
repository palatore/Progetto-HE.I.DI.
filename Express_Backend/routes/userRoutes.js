const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken.js');
const UserControllers = require('../controllers/userControllers');
const User = require('../models/user.js');

router.get('/utenti', UserControllers.getUsers);
router.get('/utente/:id_utente', authenticateToken, UserControllers.getUtenteById);
router.get('/infoUtente/:id_utente', authenticateToken, UserControllers.getInfoUtenteById);
router.get('/ruoli/:ruolo', UserControllers.getUtentiByRuolo);
router.get('/associazioniUtente', authenticateToken, UserControllers.getAssociazioniUtente);
router.get('/ruoloProfessionista/:id_professionista', authenticateToken, UserControllers.getRuoloProfessionista);
router.post('/utente/creaAssociazione', authenticateToken, UserControllers.creaAssociazione);
router.post('/utente/creaInfo', authenticateToken, UserControllers.creaInfo);
router.post('/utente/riempiInfo', authenticateToken, UserControllers.riempiInfo);
router.delete('/eliminaEta/:id_utente', authenticateToken, UserControllers.eliminaEta);

module.exports = router;