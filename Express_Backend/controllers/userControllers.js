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
            const id_utente = req.params.id_utente;
            const dati = await UserServices.getUtenteById(id_utente);
            if(dati){
                res.json(dati);
            }else{
                res.status(404).json({error: 'Controller: dati non trovati'});
            }
        } catch(e) {
            res.status(500).json({error: e.message});
            
        }
    };

    static getInfoUtenteById = async (req, res) =>{
        console.log('Controller chiamato');
        try{
            const id_utente = req.params.id_utente;
            console.log('Controller: sto passando:', id_utente);
            const info = await UserServices.getInfoUtenteById(id_utente);
            if(info){
                res.json(info);
            }else{
                res.status(404).json({error: 'Controller: info non trovate' });
            }
        }catch(e){
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

    static getRuoloProfessionista = async (req, res) => {
        try {
            const id_professionista = req.params.id_professionista;
            const result = await UserServices.getRuoloProfessionista(id_professionista);
            if(result){
                console.log('Ruolo in arrivo:', result);
                res.json(result);
            } else {
                res.status(404).json({error: 'Ruolo non trovato'});
            }
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static getAssociazioniUtente = async (req, res) => {
        try {
            const id_utente = req.user.id;
            console.log(id_utente);
            const result = await UserServices.getAssociazioniUtente(id_utente);
            if(result){
                console.log('Arrivano le associazioni');
                res.json(result);
            } else {
                res.status(404).json({error: 'Associazioi non trovate'});
            }
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static creaAssociazione = async (req, res) => {
        try {
            const id_utente = req.user.id;
            const { id_persona } = req.body;
            const result = await UserServices.creaAssociazione(id_utente, id_persona);
            res.status(201).json({message: 'Associazione creata con successo', result});
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };


    static creaInfo = async (req, res) =>{
        try{
            const id_utente = req.user.id;
            const result = await UserServices.creaInfo(id_utente);
           res.status(201).json({message: 'Info create con successo', id: result.lastID});
        }catch(e){
            res.status(500).json({error: e.message});
        }
    };

    static riempiInfo = async (req, res) =>{
        try{
            const {info} = req.body;
            const result = await UserServices.riempiInfo(info);
            res.status(201).json({message: 'Info riempite con successo', result});
        }catch(e){
            res.status(500).json({error: e.message});
        }
    };

    static eliminaEta = async (req, res) =>{
        console.log('elimina età chiamato');
        try{
            const id_utente = req.params.id_utente;
            console.log('CONTROLLER cerco di eliminare info con id utente:', id_utente);
            await UserServices.eliminaEta(id_utente);
            res.status(201).json({message: 'Età fatta fuori'});
        }catch(e){
            res.status(500).json({error: e.message});
        }
    };

}
module.exports = UserControllers;