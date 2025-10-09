const PastiServices = require('../services/pastiServices');

class PastiControllers {

    static getAlimenti = async (req, res) => {
        try {
            const alimenti = await PastiServices.getAllAlimenti();
            res.json(alimenti);
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static getPasti = async (req, res) => {
        try {
            const pasti = await PastiServices.getAllPasti();
            res.json(pasti);
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    };

    static getAlimentiPasti = async (req, res) => {
        try {
            const alimentiPasti = await PastiServices.getAllAlimentiPasti();
            res.json(alimentiPasti);
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    };

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

    static getPastiUtente = async (req, res) => {
        try {
            const user_id = req.user.id;
            console.log('ID utente:', user_id);
            const pastiUtente = await PastiServices.getPastiUtente(user_id);
            res.json(pastiUtente);
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    }

    static checkPasto = async (req, res) => {
        console.log('Controllo pasto in corso...');
        try {
            const {nome, data, tipo} = req.body;
            const user_id = req.user.id;
            console.log('I tuoi dati:', user_id, nome, data, tipo);
            const exists = await PastiServices.checkPasto(user_id, nome, data, tipo);
            res.status(200).json({exists});
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    };

    static creaPasti = async (req, res) => {
        try {
            const {nome, data, tipo} = req.body;
            const user_id = req.user.id;
            const result = await PastiServices.creaPasti(user_id, nome, data, tipo);
            res.status(201).json({message: 'Pasto creato con successo', id: result.lastID});
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    };

    static riempiPasto = async (req, res) => {
        console.log('RiempiPasto controller chiamato');
        try {
            const {id_pasto, alimenti, bevande} = req.body;
            const user_id = req.user.id;
            const result = await PastiServices.riempiPasto(id_pasto, alimenti, bevande);
            res.status(201).json({message: 'Pasto riempito con successo', result});
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    }

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