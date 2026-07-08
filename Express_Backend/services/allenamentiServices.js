const db = require('../db.js');
const Allenamenti = require('../models/allenamenti.js');

class AllenamentiServices {

    static async getAllEsercizi(){
        console.log('Chiamo il model per ottenere tutti gli esercizi');
        const esercizi = await Allenamenti.getAllEsercizi();
        console.log('Esercizi ottenuti:', esercizi);
        return esercizi;    
    };

    static async getEsercizioById(id_esercizio){
        console.log('Chiamo il model per ottenere un esercizio dato il suo ID:', id_esercizio);
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
        console.log('Chiamo il model per ottenere tutti gli allenamenti');
        const allenamenti = await Allenamenti.getAllAllenamenti();
        console.log('Allenamenti ottenuti:', allenamenti);
        return allenamenti;
    };

    static async getAllEserciziAllenamento(){
        console.log('Chiamo il model per ottenere tutti gli esercizi in un allenamento');
        const eserciziAllenamento = await Allenamenti.getAllEserciziAllenamento();
        console.log('esercizi_allenamento ottenuti:', eserciziAllenamento);
        return eserciziAllenamento;
    };

    static async getDettagliAllenamento(id_allenamento){
        console.log('Sono il Service, ID allenamento:', id_allenamento);
        //Chiamo il model per assicurarmi che l'allenamento esista
        const allenamento = await Allenamenti.findAllenamentoById(id_allenamento);
        console.log('Da Service, Allenamento trovato:', allenamento);
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
        console.log('Nel Service risulta:', giorno);
        //controlla se esiste un allenamento in quel giorno
        const allenamento = await Allenamenti.checkAllenamento(user_id, giorno);
        console.log('Nel Service il check risulta:', allenamento);
        if(allenamento){
            console.log('Esiste già un allenamento in questo giorno', allenamento);
        }else{
            console.log('Nessun allenamento trovato con questi dati');
        }
        return allenamento;
    };

    static async creaAllenamenti(user_id, nome, giorno, durata, data_creazione){
        console.log('SERVICE: ricevo e mando:', user_id, data_creazione);
        //crea un nuovo allenamento per l'utente
        const nuovoAllenamento = await Allenamenti.creaAllenamenti(user_id, nome, giorno, durata, data_creazione);
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
        console.log('Service: Dati ricevuti per riempire allenamento:', id_allenamento, esercizi);
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
        if(result){
            console.log('Sono il Service,Allenamento modificato con successo:', result);
        }else{
            console.log('Errore nella modifica dell\'allenamento con id:', id_allenamento);
        }
        return result;
    }

    static async programmaAllenamento(id_allenamento, data_calendario) {
        //programma nel calendario un allenamento esistente
        const risultatoProgrammazione = await Allenamenti.programmaAllenamento(id_allenamento, data_calendario);
        console.log("SERVIZIO SPAMMMONE ECCO IL MIO ALLENAMENTO", risultatoProgrammazione);
        if(risultatoProgrammazione) {
            console.log('Allenamento programmato con successo');
        } else {
            console.log('Errore nella programmazione dell\'allenamento con ID:', id_allenamento, 'per la data', data_calendario);
        }
        return risultatoProgrammazione;
    }

    static async clonaAllenamento(id_allenamento, id_nuovo_utente) {
        const dati_vecchio_allenamento = await Allenamenti.findAllenamentoById(id_allenamento);
        if(!dati_allenamento) {
            console.log('Allenamento non trovato');
            return null;
        }
        
        const id_nuovo_allenamento = await Allenamenti.creaAllenamenti(id_nuovo_utente, dati_allenamento.name, dati_allenamento.data, dati_allenamento.durata);
        if(!id_nuovo_allenamento) {
            console.log('Errore nella creazione del nuovo allenamento clonato');
            return null;
        }

        const dettagli_vecchio_allenamento = Allenamenti.getDettagliAllenamento(id_allenamento, dati_vecchio_allenamento);
        if(!dettagli_vecchio_allenamento || dettagli_vecchio_allenamento.length === 0) {
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

        const dettagli_inseriti = await Allenamenti.riempiAllenamento(id_nuovo_allenamento, dettagli_nuovo_allenamento);
        if(dettagli_inseriti) {
            console.log('Allenamento clonato con successo');
            return dettagli_inseriti;
        } else {
            console.log('Errore nell\'inserimento dettagli del nuovo allenamento clonato');
        }
        return dettagli_inseriti;
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