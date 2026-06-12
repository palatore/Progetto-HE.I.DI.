const db = require('../db.js');
const Pasti = require('../models/pasti');

class PastiServices {

    static async getAllAlimenti() {
        console.log('Chiamo il model per ottenere tutti gli alimenti');
        const alimenti = await Pasti.getAllAlimenti();
        console.log('Alimenti ottenuti:', alimenti);
        return alimenti;
    };

    static async getAlimentoById(id_alimento) {
        console.log('Chiamo il model per ottenere un alimento dato il suo ID:', id_alimento);
        const alimento = await Pasti.getAlimentoById(id_alimento);
        if (alimento) {
            console.log('Alimento ottenuto:', alimento);
            return alimento;
        } else {
            console.log('Alimento non trovato con ID:', id_alimento);
            return null;
        }
    };

    static async getAllPasti() {
        console.log('Chiamo il model per ottenere tutti i pasti');
        const pasti = await Pasti.getAllPasti();
        console.log('Pasti ottenuti:', pasti);
        return pasti;
    };

    static async getAllAlimentiPasti() {
        console.log('Chiamo il model per ottenere tutti gli alimenti_pasti');
        const alimentiPasti = await Pasti.getAllAlimentiPasti();
        console.log('Alimenti_pasti ottenuti:', alimentiPasti);
        return alimentiPasti;
    };

    static async getDettagliPasto(id_pasto) {
        //Per prima cosa chiamo il model per controllare che il pasto esista
        const pasto = await Pasti.findPastoById(id_pasto);
        if (!pasto) {
            console.log('Pasto non trovato con ID:', id_pasto);
            return null;
        } else {
        //Procedo alla ricerca dei dettagli del pasto
            const dettagliPasto = await Pasti.getDettagliPasto(id_pasto, pasto);
            console.log('Dettagli pasto ottenuti:', dettagliPasto);
            return dettagliPasto;
        }
    };

    static async getPastiUtente(user_id) {
        //ottieni tutti i pasti appartenenti all'utente
        const pastiUtente = await Pasti.getPastiUtente(user_id);
        if (pastiUtente && pastiUtente.length > 0) {
            console.log('Pasti utente ottenuti:', pastiUtente);
            return pastiUtente;
        } else {
            console.log('Nessun pasto trovato per l\'utente con ID:', user_id);
            return [];
        };
    };

    static async checkPasto(user_id, nome, tipo) {
        //controlla se esiste già un pasto con lo stesso nome, data e tipo per l'utente
        const pasto = await Pasti.checkPasto(user_id, nome, tipo);
        if (pasto) {
            console.log('Pasto già esistente:', pasto);
        } else {
            console.log('Nessun risultato trovato con questi dati');
        }
        return pasto;
    };

    static async creaPasti(user_id, nome, tipo) {
        //crea un nuovo pasto per l'utente
        const nuovoPasto = await Pasti.creaPasti(user_id, nome, tipo);
        if (nuovoPasto) {
            console.log('Pasto creato con successo:');
        } else {
            console.log('Errore nella creazione del pasto');
        }
        return nuovoPasto;
    };

    static async riempiPasto(id_pasto, alimenti) {
        //dopo la creazione di un pasto, riempi quel pasto con alimenti presi dal database
        console.log('RiempiPasto service chiamato');
        const contenutoPasto = await Pasti.riempiPasto(id_pasto, alimenti);
        if (contenutoPasto) {
            console.log('Pasto riempito con successo:', contenutoPasto);
        } else {
            console.log('Errore nel riempimento del pasto');
        }
        return contenutoPasto;
    }

    static async modificaPasto(id_pasto, modifiche_pasto) {
        //per prima cosa controllo che il pasto esista
        const pasto = await Pasti.findPastoById(id_pasto);
        if (!pasto) {
            console.log('Pasto non trovato con ID:', id_pasto);
            return null;
        }
        //in seguito, cancello i dettagli già esistenti del pasto
        const risultatoElimanzione = await Pasti.eliminaDettagliPasto(id_pasto);
        if(risultatoElimanzione) {
            console.log('Dettagli pasto con id:', id_pasto, 'eliminati con successo');
        } else {
            console.log('Errore nell\'eliminazione del pasto con id:', id_pasto);
            return risultatoElimanzione;
        }
        //infine, inserisco i nuovi dettagli del pasto nel db
        const result = await Pasti.riempiPasto(id_pasto, modifiche_pasto);
        if (result) {
            console.log('Pasto modificato con successo:', result);
        } else {
            console.log('Errore nella modifica del pasto con id:', id_pasto, 'e modifiche:', modifiche_pasto);
        }
        return result;

    }
    
    static async eliminaPasto(id_pasto) {
        //elimina un pasto esistente, prima eliminando le relazioni con gli alimenti e poi eliminando il pasto stesso
        console.log('EliminaPasto service chiamato per ID pasto:', id_pasto);
        const risultatoEliminazione = await Pasti.eliminaPasto(id_pasto);
        if (risultatoEliminazione) {
            console.log('Pasto eliminato con successo:');
        } else {
            console.log('Errore nell\'eliminazione del pasto o pasto non trovato');
        }
        return risultatoEliminazione;
    }

}

module.exports = PastiServices;