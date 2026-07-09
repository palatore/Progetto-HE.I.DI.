const AllenamentiServices = require('../services/allenamentiServices');

class AllenamentiControllers {

    static getEsercizi = async (req, res) =>{
        try {
            const esercizi = await AllenamentiServices.getAllEsercizi();
            res.json(esercizi);
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    //restituisce un esercizio dato il suo ID
    static getEsercizioById = async (req, res) => {
        try {
            const id_esercizio = req.params.id_esercizio;
            const esercizio = await AllenamentiServices.getEsercizioById(id_esercizio);
            if(esercizio){
                res.json(esercizio);
            }else{
                res.status(404).json({error: 'Esercizio non trovato'})
            }
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static getAllenamenti = async (req, res) =>{
        try {
            const allenamenti = await AllenamentiServices.getAllAllenamenti();
            res.json(allenamenti);
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static getEserciziAllenamenti = async (req, res) =>{
        try {
            const eserciziAllenamenti = await AllenamentiServices.getAllEserciziAllenamenti();
            res.json(eserciziAllenamenti);
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static getDettagliAllenamento = async (req, res) =>{
        try {
            const id_allenamento = req.params.id_allenamento;
            const dettagliAllenamento = await AllenamentiServices.getDettagliAllenamento(id_allenamento);
            if(dettagliAllenamento){
                res.json(dettagliAllenamento);
            }else{
                res.status(400).json({error: 'allenamento non trovato'});
            }
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static getAllenamentoById = async (req, res) => {
        try {
            const id_allenamento = req.params.id_allenamento;
            const allenamento = await AllenamentiServices.getAllenamentoById(id_allenamento);
            if(allenamento){
                res.json(allenamento);
            }else{
                res.status(404).json({error: 'allenamento non trovato'});
            }
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static getAllenamentiUtente = async (req, res) =>{
        try {
            const user_id = req.user.id;
            const allenamentiUtente = await AllenamentiServices.getAllenamentiUtente(user_id);
            res.json(allenamentiUtente);
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static checkAllenamento = async (req, res) =>{
        try {
            const {giorno} = req.body;
            const user_id = req.user.id;
            const exists = await AllenamentiServices.checkAllenamento(user_id, giorno);
            res.status(200).json({exists});
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static creaAllenamenti = async (req, res) =>{
        try {
            const {nome, giorno, durata, data_creazione} = req.body;
            const user_id = req.user.id;
            const result = await AllenamentiServices.creaAllenamenti(user_id, nome, giorno, durata, data_creazione);
            res.status(201).json({message: 'Allenamento creato con successo:', id: result});
        } catch(e) {
            res.status(500).json({error: e.message});
        }

    };

    static riempiAllenamento = async (req, res) =>{
        try {
            const {id_allenamento, esercizi} = req.body;
            const user_id = req.user.id;
            const result = await AllenamentiServices.riempiAllenamento(id_allenamento, esercizi);
            res.status(201).json({message: 'Allenamento riempito con successo', id: result});
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static modificaAllenamento = async (req, res) =>{
        try {
            const {id_allenamento, modifiche_allenamento} = req.body;
            const user_id = req.user.id;
            const result = await AllenamentiServices.modificaAllenamento(id_allenamento, modifiche_allenamento);
            res.status(201).json({message: 'Allenamento modificato con successo', result});
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static programmaAllenamento = async (req, res) =>{
        try {
            const {id_allenamento, data_calendario} = req.body;
            const user_id = req.user.id;
            const result = await AllenamentiServices.programmaAllenamento(id_allenamento, data_calendario);
            res.status(201).json({message: 'Allenamento programmato con successo', result});
        } catch (e) {
            res.status(500).json({error: e.message});            
        }
    };

    static clonaAllenamento = async(req, res) => {
        try {
            const user_id = req.user.id;
            const id_allenamento = req.body.id_allenamento;
            const result = await AllenamentiServices.clonaAllenamento(id_allenamento, user_id);
            res.status(201).json({message: 'Allenamento clonato con successo', result});
        } catch (e) {
            res.status(500).json({error: e.message});            
        }
    };

    static eliminaAllenamento = async (req, res) =>{
        try {
            const id_allenamento = req.params.id_allenamento;
            await AllenamentiServices.eliminaAllenamento(id_allenamento);
            res.status(201).json({message: 'Allenamento eliminato con successo'});
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

}
module.exports = AllenamentiControllers;