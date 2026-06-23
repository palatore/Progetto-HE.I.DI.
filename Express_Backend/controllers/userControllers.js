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
    }

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


    static creaInfo = async (req, res) =>{
        try{
            const id_utente = req.user.id;
            console.log('CONTROLLER: ricevo e mando id:', id_utente);
            const result = await UserServices.creaInfo(id_utente);
           res.status(201).json({message: 'Info create con successo', id: result.lastID});
        }catch(e){
            res.status(500).json({error: e.message});
        }
    }

    static riempiInfo = async (req, res) =>{
        console.log('CONTROLLER: wake the fuck up');
        try{
            const {info} = req.body;
            console.log('CONTROLLER: ricevo e mando:', info);
            const result = await UserServices.riempiInfo(info);
            res.status(201).json({message: 'Info riempite con successo', result});
        }catch(e){
            res.status(500).json({error: e.message});
        }
    }

    static aggiornaEta = async (req, res) =>{
        try{
            const eta = req.body.eta;
            const id_utente = req.user.id;
            console.log('CONTROLLER aggiornaEta riceve e passa:', id_utente, eta);
            const result = await UserServices.aggiornaEta(id_utente, eta);
            res.status(201).json({message: 'Età aggiornata con successo:', result});
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