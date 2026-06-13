const UserServices = require('../services/userServices');

class UserControllers {

    static getUsers = async (req, res) => {
        try {
            const utenti = await UserServices.getAllUsers();
            res.json(utenti);
        } catch(e) {
            res.status(500).json({error: e.message});
        }
     };

     static getUtenteById = async (req, res) => {
        try {
            const id_utente = req.id_utente;
            const result = await UserServices.getUtenteById(id_utente);
            res.json(result);
        } catch(e) {
            res.status(500).json({error: e.message});
        }
     };

     static getUtentiByRuolo = async (req, res) => {
        try {
            const ruolo = req.params.ruolo;
            const result = await UserServices.getUtentiByRuolo(ruolo);
            if(result){
                console.log('Lista in arrivo:', result);
                res.json(result);
            } else {
                res.status(404).json({error: 'Utenti non trovati'});
            }
        } catch(e) {
            res.status(500).json({error: e.message});
        }
     };

}
module.exports = UserControllers;