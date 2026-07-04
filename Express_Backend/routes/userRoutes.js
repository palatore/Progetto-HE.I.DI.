const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken.js');
const UserControllers = require('../controllers/userControllers');
const User = require('../models/user.js');

router.get('/utenti', UserControllers.getUsers);
router.get('/utente/:id_utente', authenticateToken, UserControllers.getUtenteById);
router.get('/infoUtente/:id_utente', authenticateToken, UserControllers.getInfoUtenteById);
router.get('/ruoli/:ruolo', UserControllers.getUtentiByRuolo);
router.get('/albo', UserControllers.getAlbo);
router.get('/richieste', UserControllers.getRichieste);
router.get('/associazioniUtente', authenticateToken, UserControllers.getAssociazioniUtente);
router.get('/associazioniProfessionista', authenticateToken, UserControllers.getAssociazioniProfessionista);
router.get('/richiesteUtente', authenticateToken, UserControllers.getRichiesteUtente);
router.get('/richiesteProfessionista', authenticateToken, UserControllers.getRichiesteProfessionista);
router.get('/richiestePending', authenticateToken, UserControllers.getRichiestePending);
router.get('/ruoloProfessionista/:id_professionista', authenticateToken, UserControllers.getRuoloProfessionista);
router.post('/creaAssociazione', authenticateToken, UserControllers.creaAssociazione);
router.patch('/accettaAssociazione', authenticateToken, UserControllers.accettaAssociazione);
router.post('/creaRichiesta', authenticateToken, UserControllers.creaRichiesta);
router.post('/utente/creaInfo', authenticateToken, UserControllers.creaInfo);
router.post('/utente/riempiInfo', authenticateToken, UserControllers.riempiInfo);
router.post('/utente/aggiornaPassword/:id_utente', authenticateToken, UserControllers.aggiornaPassword);
router.delete('/annullaAssociazione/:id_associazione', authenticateToken, UserControllers.annullaAssociazione);
router.delete('/eliminaEta/:id_utente', authenticateToken, UserControllers.eliminaEta);

module.exports = router;