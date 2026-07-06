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

    static getAlbo = async (req, res) => {
        try {
            const result = await UserServices.getAlbo();
            if(result){
                console.log('Albo in arrivo:', result);
                res.json(result);
            } else {
                res.status(404).json({error: 'Albo non trovato'});
            }
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };
    static getRichieste = async (req, res) => {
        try {
            const result = await UserServices.getRichieste();
            if(result) {
                console.log('Richieste in arrivo', result);
                res.json(result);
            } else {
                res.status(404).json({error: 'non trovato'});
            }
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    }

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

    static getVotiAttivita = async (req, res) => {
        try {
            const id_attivita = req.query.id_attivita;
            const tipologia_attivita = req.query.tipologia_attivita;
            const result = await UserServices.getVotiAttivita(id_attivita, tipologia_attivita);
            if(result) {
                console.log('Voti in arrivo:', result);
                res.json(result);
            } else {
                res.status(404).json({error: 'Nessun voto'});
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
                res.status(404).json({error: 'Associazioni non trovate'});
            }
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static getAssociazioniProfessionista = async (req, res) => {
        try {
            const id_professionista = req.user.id;
            const result = await UserServices.getAssociazioniProfessionista(id_professionista);
            if(result){
                console.log('Arrivano le associazioni del professionista', result);
                res.json(result);
            } else {
                res.status(404).json({error: 'Associazioni non trovate'});
            }
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static getRichiesteUtente = async (req, res) => {
        try {
            const id_utente = req.user.id;
            const result = await UserServices.getRichiesteUtente(id_utente);
            if(result){
                console.log('Arrivano le richieste');
                res.json(result);
            } else {
                res.status(404).json({error: 'Richieste non trovate'});
            }
            
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    }

    static getRichiesteProfessionista = async (req, res) => {
        try {
            const id_professionista = req.user.id;
            const result = await UserServices.getRichiesteProfessionista(id_professionista);
            if(result){
                console.log('Arrivano le richieste');
                res.json(result);
            } else {
                res.status(404).json({error: 'Richieste non trovate'});
            }
            
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    }

    static getAssociazioniPending = async (req, res) => {
        try {
            const id_utente = req.user.id;
            const result = await UserServices.getAssociazioniPending(id_utente);
            if(result){
                console.log('Arrivano le associazioni pending');
                res.json(result);
            } else {
                res.status(404).json({error: 'Associazioni pending non trovate'});
            }
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static getRichiestePending = async (req, res) => {
        try {
            const id_utente = req.user.id;
            const result = await UserServices.getRichiestePending(id_utente);
            if(result){
                console.log('Arrivano le richieste pending');
                res.json(result);
            } else {
                res.status(404).json({error: 'Richieste pending non trovate'});
            }
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static votaAttivita = async (req, res) => {
        try {
            const id_utente = req.user.id;
            const { attivita } = req.body;
            const result = await UserServices.votaAttivita(id_utente, attivita);
            res.status(201).json({message: 'Voto piazzato con successo', result});
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

    static accettaAssociazione = async (req, res) => {
        try {
            const { id_associazione } = req.body;
            console.log('Controller: id_associazione ricevuto:', id_associazione);
            const result = await UserServices.accettaAssociazione(id_associazione);
            res.status(201).json({message: 'Associazione accettata con successo', result});
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static creaRichiesta = async (req, res) => {
        try {
            const user_id = req.user.id;
            const { dati } = req.body;
            const result = await UserServices.creaRichiesta(user_id, dati);
            res.status(201).json({message: 'Richiesta creata con successo', result});
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static accettaRichiesta = async (req, res) => {
        try {
            const { richiesta } = req.body;
            console.log('Ho ricevuto l\'oggetto', richiesta);
            const result = await UserServices.accettaRichiesta(richiesta);
            res.status(201).json({message: 'Richiesta accettata con successo', result});
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

    static aggiornaPassword = async (req, res) =>{
        try{
            const id_utente = req.user.id;
            const { nuovaPassword } = req.body;
            const result = await UserServices.aggiornaPassword(id_utente, nuovaPassword);
            res.status(201).json({message: 'Password aggiornata con successo', result});
        }catch(e){
            res.status(500).json({error: e.message});
        }
    }

    static annullaAssociazione = async (req, res) => {
        try {
            const id_associazione = req.params.id_associazione;
            const result = await UserServices.annullaAssociazione(id_associazione);
            res.status(201).json({message: 'Associazione annullata con successo', result});
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static annullaRichiesta = async (req, res) => {
        try {
            const id_richiesta = req.params.id_richiesta;
            const result = await UserServices.annullaRichiesta(id_richiesta);
            res.status(201).json({message: 'Richiesta annullata con successo', result});
        } catch(e) {
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