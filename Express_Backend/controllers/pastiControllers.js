const PastiServices = require('../services/pastiServices');

class PastiControllers {

    //GET dammi tutti gli alimenti
    static getAlimenti = async (req, res) => {
        try {
            const alimenti = await PastiServices.getAllAlimenti();
            res.json(alimenti);
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    //GET restituiscimi un alimento dato il suo ID
    static getAlimentoById = async (req, res) => {
        try {
            const id_alimento = req.params.id_alimento;
            console.log('ID alimento:', id_alimento);
            const alimento = await PastiServices.getAlimentoById(id_alimento);
            if(alimento) {
                console.log('Alimento trovato:', alimento);
                res.json(alimento);
            } else {
                res.status(404).json({error: 'Alimento non trovato'});
            }
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    //GET dammi tutti i pasti
    static getPasti = async (req, res) => {
        try {
            const pasti = await PastiServices.getAllPasti();
            res.json(pasti);
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    };

    //GET dammi tutti i dettagli di tutti i pasti
    static getAlimentiPasti = async (req, res) => {
        try {
            const alimentiPasti = await PastiServices.getAllAlimentiPasti();
            res.json(alimentiPasti);
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    };

    //GET dammi i dettagli di un singolo pasto dato il suo ID
    static getDettagliPasto = async (req, res) => {
        try {
            const id_pasto = req.params.id_pasto;
            console.log('ID pasto:', id_pasto);
            const dettagliPasto = await PastiServices.getDettagliPasto(id_pasto);
            if (dettagliPasto) {
                res.json(dettagliPasto);
            } else {
                res.status(404).json({error: 'Pasto non trovato'});
            }
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    };

    //GET dammi tutti i pasti relativi a un utente dato il suo ID
    static getPastiUtente = async (req, res) => {
        try {
            const user_id = req.user.id;
            console.log('ID utente:', user_id);
            const pastiUtente = await PastiServices.getPastiUtente(user_id);
            res.json(pastiUtente);
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    };

    //GET dammi tutti i pasti programmati nel calendario relativi a un utente dato il suo ID
    static getPastiProgrammati = async (req, res) => {
        try {
            const user_id = req.user.id;
            console.log('ID utente:', user_id);
            const pastiProgrammati = await PastiServices.getPastiProgrammati(user_id);
            res.json(pastiProgrammati);
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    };

    //POST controlla se un pasto, dato il nome e il tipo, esiste già nel database per l'utente
    static checkPasto = async (req, res) => {
        console.log('Controllo pasto in corso...');
        try {
            const {nome, tipo} = req.body;
            const user_id = req.user.id;
            console.log('I tuoi dati:', user_id, nome, tipo);
            const exists = await PastiServices.checkPasto(user_id, nome, tipo);
            res.status(200).json({exists});
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    };

    //POST salva un nuovo pasto nel database
    static creaPasti = async (req, res) => {
        try {
            const {nome, tipo, data_creazione} = req.body;
            const user_id = req.user.id;
            const result = await PastiServices.creaPasti(user_id, nome, tipo, data_creazione);
            res.status(201).json({message: 'Pasto creato con successo', id: result.lastID});
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    };

    //POST aggiungi i dettagli di un determinato pasto nel detabase
    static riempiPasto = async (req, res) => {
        console.log('RiempiPasto controller chiamato');
        try {
            const {id_pasto, alimenti} = req.body;
            const user_id = req.user.id;
            const result = await PastiServices.riempiPasto(id_pasto, alimenti);
            res.status(201).json({message: 'Pasto riempito con successo', result});
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    };

    //POST modifica i dettagli di un determinato pasto nel database
    static modificaPasto = async (req, res) => {
        console.log('ModificaPasto controller chiamato');
        try {
            const {id_pasto, modifiche_pasto} = req.body;
            const user_id = req.user.id;
            const result = await PastiServices.modificaPasto(id_pasto, modifiche_pasto);
            res.status(201).json({message: 'Pasto modificato con successo', result});
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    //POST inserisci nel calendario un determinato pasto
    static programmaPasto = async (req, res) => {
        console.log('ProgrammaPasto controller chiamato');
        try {
            const {id_pasto, data_calendario} = req.body;
            const user_id = req.user.id;
            const result = await PastiServices.programmaPasto(id_pasto, data_calendario);
            res.status(201).json({message: 'Pasto programmato con successo', result});
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    }

    //DELETE elimina un pasto dato il suo ID
    static eliminaPasto = async (req, res) => {
        try {
            const id_pasto = req.params.id_pasto;
            console.log('Eliminazione pasto con ID:', id_pasto);
            await PastiServices.eliminaPasto(id_pasto);
            res.status(201).json({message: 'Pasto eliminato con successo'});
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    };

}
module.exports = PastiControllers;