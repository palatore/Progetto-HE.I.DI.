const express = require('express');
const router = express.Router();
const UserControllers = require('../controllers/userControllers');

router.get('/utenti', UserControllers.getUsers);
router.get('/dietologi', UserControllers.getDietologi);

module.exports = router;