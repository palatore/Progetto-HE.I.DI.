const AllenamentiServices = require('../services/allenamentiServices');

class AllenamentiControllers {

    static getEsercizi = async (req, res) =>{
        try{
            const esercizi = await AllenamentiServices.getAllEsercizi();
            res.json(esercizi);
        }catch(e){
            res.status(500).json({error: e.message});
        }
    };

    static getAllenamenti = async (req, res) =>{
        try{
            const allenamenti = await AllenamentiServices.getAllAllenamenti();
            res.json(allenamenti);
        }catch(e){
            res.status(500).json({error: e.message});
        }
    };

    static getEserciziAllenamenti = async (req, res) =>{
        try{
            const eserciziAllenamenti = await AllenamentiServices.getAllEserciziAllenamenti();
            res.json(eserciziAllenamenti);
        }catch(e){
            trs.status(500).json({error: e.message});
        }
    };

    static getDettagliAllenamento = async (req, res) =>{
        try{
            const id_allenamento = req.params.id_allenamento;
            console.log('ID allenamento:', id_allenamento);
            const dettagliAllenamento = await AllenamentiServices.getDettagliAllenamento(id_allenamento);
            if(dettagliAllenamento){
                res.json(dettagliAllenamento);
            }else{
                res.status(400).json({error: 'allenamento non trovato'});
            }
        }catch(e){
            res.status(500).json({error: e.message});
        }
    };

    static getAllenamentiUtente = async (req, res) =>{
        try{
            const user_id = req.user.id;
            console.log('ID utente:', user_id);
            const allenamentiUtente = await AllenamentiServices.getAllenamentiUtente(user_id);
            res.json(allenamentiUtente);
        }catch(e){
            res.status(500).json({error: e.message});
        }
    };

    static checkAllenamento = async (req, res) =>{
        console.log('Controllo allenamento in corso...');
        try{
            const giorno = req.params.giorno;
            const user_id = req.user.id;
            console.log('I tuoi dati:', user_id, giorno);
            const exists = await AllenamentiServices.checkAllenamento(user_id, giorno);
            res.status(200).json({exists});
        }catch(e){
            res.status(500).json({error: e.message});
        }
    };

    static creaAllenamenti = async (req, res) =>{
        try{
            const {nome, giorno, data} = req.body;
            const user_id = req.user.id;
            console.log('dati richiesta:', user_id, nome, giorno, data);
            const result = await AllenamentiServices.creaAllenamenti(user_id, nome, giorno, data);
            res.status(201).json({message: 'Allenamento creato con successo:', id: result.lastID});
        }catch(e){
            res.status(500).json({error: e.message});
        }

    };

    static riempiAllenamento = async (req, res) =>{
        console.log('RiempiAllenamento controller chiamato');
        try{
            const {id_allenamento, esercizi} = req.body;
            const user_id = req.user.id;
            const result = await AllenamentiServices.riempiAllenamento(id_allenamento, esercizi);
            res.status(201).json({message: 'Allenamento riempito con successo', result});
        }catch(e){
            res.status(500).json({error: e.message});
        }
    };

    static eliminaAllenamento = async (req, res) =>{
        try{
            const id_allenamento = req.params.id_allenamento;
            console.log('Eliminazione allenamento con ID:', id_allenamento);
            await AllenamentiServices.eliminaAllenamento(id_allenamento);
            res.status(201).json({message: 'Allenamento eliminato con successo'});
        }catch(e){
            res.status(500).json({error: e.message});
        }
    };

}
module.exports = AllenamentiControllers;