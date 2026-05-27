const db = require('../db.js');
const allenamentiModel = require('../models/allenamenti.js');

class AllenamentiServices {

    static async getAllEsercizi(){
        console.log('Chiamo il model per ottenere tutti gli esercizi');
        const esercizi = await allenamentiModel.getAllEsercizi();
        console.log('Esercizi ottenuti:', esercizi);
        return esercizi;    
    };

    static async getAllAllenamenti(){
        console.log('Chiamo il model per ottenere tutti gli allenamenti');
        const allenamenti = await allenamentiModel.getAllAllenamenti();
        console.log('Allenamenti ottenuti:', allenamenti);
        return allenamenti;
    };

    static async getAllEserciziAllenamento(){
        console.log('Chiamo il model per ottenere tutti gli esercizi in un allenamento');
        const eserciziAllenamento = await allenamentiModel.getAllEserciziAllenamento();
        console.log('esercizi_allenamento ottenuti:', eserciziAllenamento);
        return eserciziAllenamento;
    };

    static async getDettagliAllenamento(id_allenamento){
        //Chiamo il model per assicurarmi che l'allenamento esista
        const allenamento = await allenamentiModel.findAllenamentoById(id_allenamento);
        if(!allenamento){
            console.log('Nessun allenamento con ID:', id_allenamento);
            return null;
        } else {
            //Procedo alla ricerca dei dettagli dell'allenamento
            const dettagliAllenamento = await allenamentiModel.getDettagliAllenamento(id_allenamento, allenamento);
            console.log('Dettagli allenamento ottenuti:', dettagliAllenamento);
            return dettagliAllenamento;
        }
    };

    static async getAllenamentiUtente(user_id){
        //ottieni tutti gli allenamenti appartenenti ad un utente
        const allenamentiUtente = await allenamentiModel.getAllenamentiUtente(user_id);
        if(allenamentiUtente && allenamentiUtente.length > 0){
            console.log('Allenamenti utente ottenuti:', allenamentiUtente);
            return allenamentiUtente;
        }else{
            console.log('Nessun allenamento trovato per l\'utente con ID:', user_id);
            return[];
        }
    };

    static async checkAllenamento(user_id, giorno){
        //controlla se esiste un allenamento in quel giorno
        const allenamento = await allenamentiModel.checkAllenamento(user_id, giorno);
        if(allenamento){
            console.log('Esiste già un allenamento in questo giorno', allenamento);
        }else{
            console.log('Nessun allenamento trovato con questi dati');
        }
        return allenamento;
    };

    static async creaAllenamenti(user_id, nome, giorno, durata, data){
        //crea un nuovo allenamento per l'utente
        const nuovoAllenamento = await allenamentiModel.creaAllenamenti(user_id, nome, giorno, durata, data);
        if(nuovoAllenamento){
            console.log('Allenamento creato con successo');
        }else{
            console.log('Errore nella creazione dell\'allenamento');
        }
        return nuovoAllenamento;
    };

    static async riempiAllenamento(id_allenamento, esercizi){
        //dopo la creazione dell'allenamento si riempie con elementi presenti nel db
        console.log('RiempiAllenamento service chiamato');
        const contenutoAllenamento = await allenamentiModel.riempiAllenamento(id_allenamento, esercizi);
        if(contenutoAllenamento){
            console.log('Allenamento riempito con successo', contenutoAllenamento);
        }else{
            console.log('Errore nel riempimento dell\'allenamento');
        }
        return contenutoAllenamento;
    };

    static async eliminaAllenamento(id_allenamento){
        //elimina un allenamento esistente
        console.log('EliminaAllenamento service chiamato su ID:', id_allenamento);
        const risultatoEliminazione = await allenamentiModel.eliminaAllenamento(id_allenamento);
        if(risultatoEliminazione){
            console.log('Allenamento eliminato con successo');
        }else{
            console.log('Errore nell\'eliminazione dell\'allenamento o allenamento non trovato');
        }
        return risultatoEliminazione;
    };
    
}

module.exports = AllenamentiServices;