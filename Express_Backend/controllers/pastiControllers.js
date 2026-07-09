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
            const alimento = await PastiServices.getAlimentoById(id_alimento);
            if(alimento) {
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

    //GET dammi un pasto dato il suo ID
    static getPastoById = async (req, res) => {
        try {
            const id_pasto = req.params.id_pasto;
            const pasto = await PastiServices.getPastoById(id_pasto);
            if(pasto) {
                res.json(pasto);
            } else {
                res.status(404).json({error: 'Pasto non trovato'});
            }
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    //GET dammi tutti i pasti relativi a un utente dato il suo ID
    static getPastiUtente = async (req, res) => {
        try {
            const user_id = req.user.id;
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
            const pastiProgrammati = await PastiServices.getPastiProgrammati(user_id);
            res.json(pastiProgrammati);
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    };

    //POST controlla se un pasto, dato il nome e il tipo, esiste già nel database per l'utente
    static checkPasto = async (req, res) => {
        try {
            const {nome, tipo} = req.body;
            const user_id = req.user.id;
            const exists = await PastiServices.checkPasto(user_id, nome, tipo);
            res.status(201).json({exists});
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
            res.status(201).json({message: 'Pasto creato con successo', id: result});
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    };

    //POST aggiungi i dettagli di un determinato pasto nel detabase
    static riempiPasto = async (req, res) => {
        try {
            const {id_pasto, alimenti} = req.body;
            const user_id = req.user.id;
            const result = await PastiServices.riempiPasto(id_pasto, alimenti);
            res.status(201).json({message: 'Pasto riempito con successo', id: result});
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    };

    //POST modifica i dettagli di un determinato pasto nel database
    static modificaPasto = async (req, res) => {
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
        try {
            const {id_pasto, data_calendario} = req.body;
            const user_id = req.user.id;
            const result = await PastiServices.programmaPasto(id_pasto, data_calendario);
            res.status(201).json({result});
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    //POST clona un pasto della bacheca nei pasti utente dato il suo id
    static clonaPasto = async (req, res) => {
        try {
            const user_id = req.user.id;
            const id_pasto = req.body.id_pasto;
            const result = await PastiServices.clonaPasto(id_pasto, user_id);
            res.status(201).json({message: 'Pasto clonato con successo', result});
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    }

    //DELETE cancella un pasto dalla programmazione del calendario
    static disdiciPasto = async (req, res) => {
        try {
            const id_pasto = req.body.id_pasto;
            const data_calendario = req.body.data_calendario;
            const user_id = req.user.id;
            await PastiServices.disdiciPasto(id_pasto, data_calendario);
            res.status(201).json({message: 'Pasto disdetto con successo'});
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    };

    //DELETE elimina un pasto dato il suo ID
    static eliminaPasto = async (req, res) => {
        try {
            const id_pasto = req.params.id_pasto;
            await PastiServices.eliminaPasto(id_pasto);
            res.status(201).json({message: 'Pasto eliminato con successo'});
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    };

}
module.exports = PastiControllers;