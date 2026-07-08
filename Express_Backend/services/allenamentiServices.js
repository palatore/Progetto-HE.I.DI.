const db = require('../db.js');
const Allenamenti = require('../models/allenamenti.js');

class AllenamentiServices {

    static async getAllEsercizi(){
        const esercizi = await Allenamenti.getAllEsercizi();
        return esercizi;    
    };

    static async getEsercizioById(id_esercizio){
        const esercizio = await Allenamenti.getEsercizioById(id_esercizio);
        if(!esercizio){
            console.log('Esercizio non trovato con ID:', id_esercizio);
            return null;
        }
        return esercizio;
    };

    static async getAllAllenamenti(){
        const allenamenti = await Allenamenti.getAllAllenamenti();
        return allenamenti;
    };

    static async getAllEserciziAllenamento(){
        const esercizi_allenamento = await Allenamenti.getAllEserciziAllenamento();
        return esercizi_allenamento;
    };

    static async getDettagliAllenamento(id_allenamento){
        const allenamento = await Allenamenti.findAllenamentoById(id_allenamento);
        if(!allenamento){
            console.log('Nessun allenamento con ID:', id_allenamento);
            return null;
        }
        const dettagli_allenamento = await Allenamenti.getDettagliAllenamento(id_allenamento, allenamento);
        if(!dettagli_allenamento) {
            return null;
        }
        return dettagli_allenamento;
    };

    static async getAllenamentoById(id_allenamento) {
        const allenamento = await Allenamenti.findAllenamentoById(id_allenamento);
        if(!allenamento){
            console.log('Nessun allenamento con ID:', id_allenamento);
            return null;
        }
        return allenamento;
    }

    static async getAllenamentiUtente(user_id){
        //ottieni tutti gli allenamenti appartenenti ad un utente
        const allenamenti_utente = await Allenamenti.getAllenamentiUtente(user_id);
        if(!(allenamenti_utente && allenamenti_utente.length > 0)){
            console.log('Nessun allenamento trovato per l\'utente con ID:', user_id);
            return[];
        }
        return allenamenti_utente;
    };

    static async checkAllenamento(user_id, giorno){
        const allenamento = await Allenamenti.checkAllenamento(user_id, giorno);
        if(!allenamento){
            console.log('Nessun allenamento trovato con questi dati');
            return null;
        }
        return allenamento;
    };

    static async creaAllenamenti(user_id, nome, giorno, durata, data_creazione){
        const nuovoAllenamento = await Allenamenti.creaAllenamenti(user_id, nome, giorno, durata, data_creazione);
        if(!nuovoAllenamento){
            throw new Error('Errore nella creazione dell\'allenamento');
        }
        return nuovoAllenamento;
    };

    static async riempiAllenamento(id_allenamento, esercizi){
        const contenutoAllenamento = await Allenamenti.riempiAllenamento(id_allenamento, esercizi);
        if(!contenutoAllenamento){
            throw new Error('Errore nel riempimento dell\'allenamento');
        }
        return contenutoAllenamento;
    };

    static async modificaAllenamento(id_allenamento, modifiche_allenamento){
        const allenamento = await Allenamenti.findAllenamentoById(id_allenamento);
        if(!allenamento){
            console.log('Nessun allenamento trovato con ID:', id_allenamento);
            return null;
        }
        const risultatoEliminazione = await Allenamenti.eliminaDettagliAllenamento(id_allenamento);
        if(!risultatoEliminazione){
            throw new Error('Errore nell\'eliminazione dei dettagli dell\'allenamento con id:', id_allenamento);
        }
        const result = await Allenamenti.riempiAllenamento(id_allenamento, modifiche_allenamento);
        if(!result){
           throw new Error('Errore nella modifica dell\'allenamento con id:', id_allenamento);
        }
        return result;
    }

    static async programmaAllenamento(id_allenamento, data_calendario) {
        const risultatoProgrammazione = await Allenamenti.programmaAllenamento(id_allenamento, data_calendario);
        if(!risultatoProgrammazione) {
            throw new Error('Errore nella programmazione dell\'allenamento con ID:', id_allenamento, 'per la data', data_calendario);
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
        const risultatoEliminazione = await Allenamenti.eliminaAllenamento(id_allenamento);
        if(!risultatoEliminazione){
            throw new Error('Errore nell\'eliminazione dell\'allenamento o allenamento non trovato');
        }
        return risultatoEliminazione;
    };
    
}

module.exports = AllenamentiServices;