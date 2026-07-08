const db = require('../db.js');
const Allenamenti = require('../models/allenamenti.js');

class AllenamentiServices {

    static async getAllEsercizi(){
        const esercizi = await Allenamenti.getAllEsercizi();
        console.log('Esercizi ottenuti:', esercizi);
        return esercizi;    
    };

    static async getEsercizioById(id_esercizio){
        const esercizio = await Allenamenti.getEsercizioById(id_esercizio);
        if(esercizio){
            console.log('Esercizio ottenuto:', esercizio);
            return esercizio;
        }else{
            console.log('Esercizio non trovato con ID:', id_esercizio);
            return null;
        }
    };

    static async getAllAllenamenti(){
        const allenamenti = await Allenamenti.getAllAllenamenti();
        console.log('Allenamenti ottenuti:', allenamenti);
        return allenamenti;
    };

    static async getAllEserciziAllenamento(){
        const eserciziAllenamento = await Allenamenti.getAllEserciziAllenamento();
        console.log('esercizi_allenamento ottenuti:', eserciziAllenamento);
        return eserciziAllenamento;
    };

    static async getDettagliAllenamento(id_allenamento){
        //Chiamo il model per assicurarmi che l'allenamento esista
        const allenamento = await Allenamenti.findAllenamentoById(id_allenamento);
        if(!allenamento){
            console.log('Nessun allenamento con ID:', id_allenamento);
            return null;
        } else {
            //Procedo alla ricerca dei dettagli dell'allenamento
            const dettagliAllenamento = await Allenamenti.getDettagliAllenamento(id_allenamento, allenamento);
            console.log('Dettagli allenamento ottenuti:', dettagliAllenamento);
            return dettagliAllenamento;
        }
    };

    static async getAllenamentoById(id_allenamento) {
        const allenamento = await Allenamenti.findAllenamentoById(id_allenamento);
        if(allenamento){
            console.log('Allenamento trovato');
            return allenamento;
        } else {
            console.log('Nessun allenamento con ID:', id_allenamento);
            return null;
        }
    }

    static async getAllenamentiUtente(user_id){
        //ottieni tutti gli allenamenti appartenenti ad un utente
        const allenamentiUtente = await Allenamenti.getAllenamentiUtente(user_id);
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
        const allenamento = await Allenamenti.checkAllenamento(user_id, giorno);
        if(allenamento){
            console.log('Esiste già un allenamento in questo giorno', allenamento);
        }else{
            console.log('Nessun allenamento trovato con questi dati');
        }
        return allenamento;
    };

    static async creaAllenamenti(user_id, nome, giorno, durata, data_creazione){
        const nuovoAllenamento = await Allenamenti.creaAllenamenti(user_id, nome, giorno, durata, data_creazione);
        if(nuovoAllenamento){
            console.log('Allenamento creato con successo', nuovoAllenamento);
        }else{
            console.log('Errore nella creazione dell\'allenamento');
        }
        return nuovoAllenamento;
    };

    static async riempiAllenamento(id_allenamento, esercizi){
        const contenutoAllenamento = await Allenamenti.riempiAllenamento(id_allenamento, esercizi);
        if(contenutoAllenamento){
            console.log('Allenamento riempito con successo', contenutoAllenamento);
        }else{
            console.log('Errore nel riempimento dell\'allenamento');
        }
        return contenutoAllenamento;
    };

    static async modificaAllenamento(id_allenamento, modifiche_allenamento){
        //per prima cosa controllo che l'allenamento esista
        const allenamento = await Allenamenti.findAllenamentoById(id_allenamento);
        if(!allenamento){
            console.log('Nessun allenamento trovato con ID:', id_allenamento);
            return null;
        }
        //in seguito, cancello i dettagli già esistenti dell'allenamento
        const risultatoEliminazione = await Allenamenti.eliminaDettagliAllenamento(id_allenamento);
        if(risultatoEliminazione){
            console.log('Dettagli allenamento con id:', id_allenamento, 'eliminati con successo');
        }else{
            console.log('Errore nell\'eliminazione dei dettagli dell\'allenamento con id:', id_allenamento);
            return risultatoEliminazione;
        }
        //infine, inserisco i nuovi dettagli dell'allenamento nel db
        const result = await Allenamenti.riempiAllenamento(id_allenamento, modifiche_allenamento);
        if(!result){
            console.log('Errore nella modifica dell\'allenamento con id:', id_allenamento);
            return null;
        }
        return result;
    }

    static async programmaAllenamento(id_allenamento, data_calendario) {
        //programma nel calendario un allenamento esistente
        const risultatoProgrammazione = await Allenamenti.programmaAllenamento(id_allenamento, data_calendario);
        if(risultatoProgrammazione) {
            console.log('Allenamento programmato con successo');
        } else {
            console.log('Errore nella programmazione dell\'allenamento con ID:', id_allenamento, 'per la data', data_calendario);
        }
        return risultatoProgrammazione;
    }

    static async clonaAllenamento(id_allenamento, id_nuovo_utente) {
        const dati_vecchio_allenamento = await Allenamenti.findAllenamentoById(id_allenamento);
        if(!dati_vecchio_allenamento) {
            console.log('Allenamento non trovato');
            return null;
        }
        
        const id_nuovo_allenamento = await Allenamenti.creaAllenamenti(id_nuovo_utente, dati_vecchio_allenamento.name, dati_vecchio_allenamento.data, dati_vecchio_allenamento.durata);
        if(!id_nuovo_allenamento) {
            console.log('Errore nella creazione del nuovo allenamento clonato');
            return null;
        }

        const dettagli_vecchio_allenamento = await Allenamenti.getDettagliAllenamento(id_allenamento, dati_vecchio_allenamento);
        if(!dettagli_vecchio_allenamento || dettagli_vecchio_allenamento.esercizi.length === 0) {
            console.log("Allenamento clonato senza dettagli");
            return id_nuovo_allenamento;
        }

        const dettagli_nuovo_allenamento = dettagli_vecchio_allenamento.esercizi.map((esercizio) => ({
            id_dettaglio: esercizio.esercizio_id,
            serie: esercizio.serie,
            ripetizioni: esercizio.ripetizioni,
            pesi_kg: esercizio.pesi_kg,
            riposo_minuti: esercizio.riposo_minuti
        }));

        return await Allenamenti.riempiAllenamento(id_nuovo_allenamento, dettagli_nuovo_allenamento);
    }

    static async eliminaAllenamento(id_allenamento){
        //elimina un allenamento esistente
        console.log('EliminaAllenamento service chiamato su ID:', id_allenamento);
        const risultatoEliminazione = await Allenamenti.eliminaAllenamento(id_allenamento);
        if(risultatoEliminazione){
            console.log('Allenamento eliminato con successo');
        }else{
            console.log('Errore nell\'eliminazione dell\'allenamento o allenamento non trovato');
        }
        return risultatoEliminazione;
    };
    
}

module.exports = AllenamentiServices;