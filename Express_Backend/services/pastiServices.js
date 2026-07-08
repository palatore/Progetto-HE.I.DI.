const db = require('../db.js');
const Pasti = require('../models/pasti');

class PastiServices {

    static async getAllAlimenti() {
        const alimenti = await Pasti.getAllAlimenti();
        return alimenti;
    }

    static async getAlimentoById(id_alimento) {
        const alimento = await Pasti.getAlimentoById(id_alimento);
        if (!alimento) {
            console.log('Alimento non trovato con ID:', id_alimento);
            return null;
        }
        return alimento;
    }

    static async getAllPasti() {
        const pasti = await Pasti.getAllPasti();
        return pasti;
    }

    static async getAllAlimentiPasti() {
        const alimentiPasti = await Pasti.getAllAlimentiPasti();
        return alimentiPasti;
    }

    static async getDettagliPasto(id_pasto) {
        const pasto = await Pasti.findPastoById(id_pasto);
        if (!pasto) {
            console.log('Pasto non trovato con ID:', id_pasto);
            return null;
        }
        const dettagli_pasto = await Pasti.getDettagliPasto(id_pasto, pasto);
        if(!dettagli_pasto) {
            return null;
        }
        return dettagli_pasto;
    }

    static async getPastoById(id_pasto) {
        const pasto = await Pasti.findPastoById(id_pasto);
        if(!pasto) {
            console.log('Pasto non trovato con ID:', id_pasto);
            return null;
        }
        return pasto;
    }

    static async getPastiUtente(user_id) {
        const pasti_utente = await Pasti.getPastiUtente(user_id);
        if (!(pasti_utente && pasti_utente.length > 0)) {
            console.log('Nessun pasto trovato per l\'utente con ID:', user_id);
            return [];
        };
        return pasti_utente;
    }

    static async getPastiProgrammati(user_id) {
        //ottieni tutti i pasti programmati nel calendario appartenenti all'utente
        const pasti_programmati = await Pasti.getPastiProgrammati(user_id);
        if (!(pasti_programmati && pasti_programmati.length > 0)) {
            console.log('Nessun pasto programmato trovato per l\'utente con ID:', user_id);
            return [];
        };
        return pasti_programmati;
    }

    static async checkPasto(user_id, nome, tipo) {
        const pasto = await Pasti.checkPasto(user_id, nome, tipo);
        if (!pasto) {
            console.log('Nessun risultato trovato con questi dati');
            return null;
        }
        return pasto;
    }

    static async creaPasti(user_id, nome, tipo, data_creazione) {
        const nuovoPasto = await Pasti.creaPasti(user_id, nome, tipo, data_creazione);
        if (!nuovoPasto) {
            throw new Error('Errore nella creazione del pasto');
        }
        return nuovoPasto;
    }

    static async riempiPasto(id_pasto, alimenti) {
        const contenutoPasto = await Pasti.riempiPasto(id_pasto, alimenti);
        if (!contenutoPasto) {
            throw new Error('Errore nel riempimento del pasto');
        }
        return contenutoPasto;
    }

    static async modificaPasto(id_pasto, modifiche_pasto) {
        const pasto = await Pasti.findPastoById(id_pasto);
        if (!pasto) {
            console.log('Pasto non trovato con ID:', id_pasto);
            return null;
        }
        const risultatoElimanzione = await Pasti.eliminaDettagliPasto(id_pasto);
        if(!risultatoElimanzione) {
            throw new Error('Errore nell\'eliminazione del pasto');
        }
        const result = await Pasti.riempiPasto(id_pasto, modifiche_pasto);
        if (!result) {
            throw new Error('Errore nella modifica del pasto');
        }
        return result;
    }

    static async programmaPasto(id_pasto, data_calendario) {
        const programmato = await Pasti.programmaPasto(id_pasto, data_calendario);
         if (!programmato) {
            throw new Error('Errore nella programmazione del pasto');
        }
        return programmato;
    }

    static async disdiciPasto(id_pasto, data_calendario) {
        const disdetto = await Pasti.disdiciPasto(id_pasto, data_calendario);
        if (!disdetto) {
            throw new Error("Errore nella disdetta del pasto o pasto non trovato");
        }
        return disdetto;
    }

    static async clonaPasto(id_pasto, id_nuovo_utente) {
        const dati_vecchio_pasto = await Pasti.findPastoById(id_pasto);
        if(!dati_vecchio_pasto) {
            console.log('Errore nella ricerca del pasto da clonare');
            return null;
        }
        const id_nuovo_pasto = await Pasti.creaPasti(id_nuovo_utente, dati_vecchio_pasto.name, dati_vecchio_pasto.tipo);
        if(!id_nuovo_pasto) {
            console.log('Errore nella creazione del nuovo pasto clonato');
            return null;
        }
        const dettagli_vecchio_pasto = await Pasti.getDettagliPasto(id_pasto, dati_vecchio_pasto);
        if(!dettagli_vecchio_pasto || dettagli_vecchio_pasto.alimenti.length === 0) {
            console.log('Pasto clonato ma senza dettagli');
            return id_nuovo_pasto;
        }
        const dettagli_nuovo_pasto = dettagli_vecchio_pasto.alimenti.map((alimento) => ({
            id_dettaglio: alimento.alimento_id,
            quantita: alimento.quantita
        }));

        const dettagli_inseriti = await Pasti.riempiPasto(id_nuovo_pasto, dettagli_nuovo_pasto);
        if(dettagli_inseriti) {
            console.log('Pasto clonato con successo');
            return dettagli_inseriti;
        } else {
            console.log('Errore nel riempimento del nuovo pasto clonato');
        }
        return dettagli_inseriti;

    }
    
    static async eliminaPasto(id_pasto) {
        const risultatoEliminazione = await Pasti.eliminaPasto(id_pasto);
        if (!risultatoEliminazione) {
            throw new Error('Errore nell\'eliminazione del pasto o pasto non trovato');
        }
        return risultatoEliminazione;
    }

}

module.exports = PastiServices;