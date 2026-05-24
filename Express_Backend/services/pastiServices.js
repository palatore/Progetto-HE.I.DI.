const db = require('../db.js');
const pastiModel = require('../models/pasti.js');

class PastiServices {

    static async getAllAlimenti() {
        console.log('Chiamo il model per ottenere tutti gli alimenti');
        const alimenti = await pastiModel.getAllAlimenti();
        console.log('Alimenti ottenuti:', alimenti);
        return alimenti;
    };

    static async getAllPasti() {
        console.log('Chiamo il model per ottenere tutti i pasti');
        const pasti = await pastiModel.getAllPasti();
        console.log('Pasti ottenuti:', pasti);
        return pasti;
    };

    static async getAllAlimentiPasti() {
        console.log('Chiamo il model per ottenere tutti gli alimenti_pasti');
        const alimentiPasti = await pastiModel.getAllAlimentiPasti();
        console.log('Alimenti_pasti ottenuti:', alimentiPasti);
        return alimentiPasti;
    };

    static async getDettagliPasto(id_pasto) {
        //Per prima cosa chiamo il model per controllare che il pasto esista
        const pasto = await pastiModel.findPastoById(id_pasto);
        if (!pasto) {
            console.log('Pasto non trovato con ID:', id_pasto);
            return null;
        } else {
        //Procedo alla ricerca dei dettagli del pasto
            const dettagliPasto = await pastiModel.getDettagliPasto(id_pasto, pasto);
            console.log('Dettagli pasto ottenuti:', dettagliPasto);
            return dettagliPasto;
        }
    };

    static async getPastiUtente(user_id) {
        //ottieni tutti i pasti appartenenti all'utente
        const pastiUtente = await pastiModel.getPastiUtente(user_id);
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
        const pasto = await pastiModel.checkPasto(user_id, nome, tipo);
        if (pasto) {
            console.log('Pasto già esistente:', pasto);
        } else {
            console.log('Nessun risultato trovato con questi dati');
        }
        return pasto;
    };

    static async creaPasti(user_id, nome, tipo) {
        //crea un nuovo pasto per l'utente
        const nuovoPasto = await pastiModel.creaPasti(user_id, nome, tipo);
        if (nuovoPasto) {
            console.log('Pasto creato con successo:');
        } else {
            console.log('Errore nella creazione del pasto');
        }
        return nuovoPasto;
    };

    static async riempiPasto(id_pasto, alimenti, bevande) {
        //dopo la creazione di un pasto, riempi quel pasto con alimenti presi dal database
        console.log('RiempiPasto service chiamato');
        const contenutoPasto = await pastiModel.riempiPasto(id_pasto, alimenti);
        if (contenutoPasto) {
            console.log('Pasto riempito con successo:', contenutoPasto);
        } else {
            console.log('Errore nel riempimento del pasto');
        }
        return contenutoPasto;
    }
    
    static async eliminaPasto(id_pasto) {
        //elimina un pasto esistente, prima eliminando le relazioni con gli alimenti e poi eliminando il pasto stesso
        console.log('EliminaPasto service chiamato per ID pasto:', id_pasto);
        const risultatoEliminazione = await pastiModel.eliminaPasto(id_pasto);
        if (risultatoEliminazione) {
            console.log('Pasto eliminato con successo:');
        } else {
            console.log('Errore nell\'eliminazione del pasto o pasto non trovato');
        }
        return risultatoEliminazione;
    }

}

module.exports = PastiServices;