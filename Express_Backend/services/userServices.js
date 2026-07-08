const db = require('../db.js');
const User = require('../models/user');

class UserServices {

    static async getUtenteById(id_utente){
        const dati = await User.findById(id_utente);
        if(!dati){
            console.log('Nessun utente con ID:', id_utente);
            return null;
        }
        return dati;
    };

    static async getInfoUtenteById(id_utente){
        const info = await User.findInfo(id_utente);
        if(!info){
            console.log('Nessuna info con id:', id_utente);
            return null;
        }
        return info;
    }

    static async getAllUsers() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM utenti', [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    return resolve(rows);
                }
            });
        });
    };

    static async getUtentiByRuolo(ruolo) {
        if(ruolo >= 0 && ruolo < 3) {
            const utenti = await User.getUtentiByRuolo(ruolo);
            if(utenti && utenti.length > 0) {
                return utenti;
            } else {
                console.log('Nessun utente con quel ruolo');
                return [];
            }
        } else if(ruolo == 3) {
            const professionisti = await User.getProfessionisti();
            if(professionisti) {
                return professionisti;
            } else {
                console.log('Nessun professionista trovato');
                return [];
            }
        } else {
            throw new Error('Ruolo non valido.');
        }
    };

    static async getAlbo() {
        const albo = await User.getAlbo();
        if(albo && albo.length > 0) {
            return albo;
        } else {
            return [];
        }
    };

    static async getRichieste() {
        const richieste = await User.getRichieste();
        if(!(richieste && richieste.length >0)) {
            return [];
        }
        return richieste;
    };

    static async getRuoloProfessionista(id_professionista) {
        const ruolo = await User.getRuoloProfessionista(id_professionista);
        if(!ruolo) {
            console.log('Nessun ruolo trovato per il professionista con ID:', id_professionista);
            return null;
        }
        return ruolo;
    };

    static async getAssociazioniUtente(id_utente) {
        const associazioni = await User.getAssociazioniUtente(id_utente);
        if(!(associazioni && associazioni.length > 0)) {
            console.log('Nessuna associazione con utenti trovata');
            return [];
        }
        return associazioni;
    };

    static async getAssociazioniProfessionista(id_professionista) {
        const associazioni = await User.getAssociazioniProfessionista(id_professionista);
        if(!(associazioni && associazioni.length > 0)) {
            console.log('Nessuna associazione con utenti trovata');
            return [];
        }
        return associazioni;
    };

    static async getRichiesteUtente(id_utente) {
        const richieste = await User.getRichiesteUtente(id_utente);
        if(!(richieste && richieste.length > 0)) {
            console.log('Nessuna richiesta trovata');
            return [];
        }
        return richieste;
    };

    static async getRichiesteProfessionista(id_professionista) {
        const richieste = await User.getRichiesteProfessionista(id_professionista);
        if(!(richieste && richieste.length > 0)) {
            console.log('Nessuna richiesta trovata');
            return [];
        }
        return richieste;
    };

static async getAssociazioniPending(id_utente) {
        const associazioni = await User.getAssociazioniPending(id_utente);
        if(!(associazioni && associazioni.length > 0)) {
            console.log('Nessuna associazione pending trovata');
            return [];
        }
        return associazioni;
    };

    static async getRichiestePending(id_utente) {
        const richieste = await User.getRichiestePending(id_utente);
        if(!(richieste && richieste.length > 0)) {
            console.log('Nessuna richiesta pending trovata');
            return [];
        }
        return richieste;
    };

    static async getFeedAssociati(id_professionsta) {
        const feed = await User.getFeedAssociati(id_professionsta);
        if(!(feed && feed.length > 0)) {
            console.log('Nessun Feed ottenuto');
            return [];
        }
        return feed;
    };

    static async creaAssociazione(id_utente, id_persona) {
        const associazione = await User.creaAssociazione(id_utente, id_persona);
        if(!associazione) {
            throw new Error('Errore nella creazione dell\'associazione');
        }
        return associazione;
    };

    static async accettaAssociazione(id_associazione) {
        const accettata = await User.accettaAssociazione(id_associazione);
        if(!accettata) {
            throw new Error('Errore nell\'accettazione dell\'associazione');
        }
        return accettata;
    };

    static async creaRichiesta(id_utente, dati) {
        const creata = await User.creaRichiesta(id_utente, dati);
        if(!creata) {
            throw new Error('Errore nella creazione della richiesta');
        }
        return creata;
    };

    static async accettaRichiesta(richiesta) {
        const id_richiesta = richiesta.id;
        const tipo = richiesta.tipo;
        if(tipo === 'MODIFICA') {
            const accettata = await User.accettaRichiesta(id_richiesta, 'MODIFICATA');
            if(!accettata) {
                throw new Error('Errore nell\'accettazione della richiesta');
            }
            return accettata;
        } else if(tipo === 'VOTO') {
            const accettata = await User.accettaRichiesta(id_richiesta, 'VOTATA');
            if(!accettata) {
                throw new Error('Errore nell\'accettazione della richiesta');
            }
            return accettata;
        }
    };

    static async riempiInfo(info){
        const nuoveInfo = await User.riempiInfo(info);
        if(!nuoveInfo){
            throw new Error('Errore nell\'inserimento delle info');
        }
        return nuoveInfo;
    }

    static async aggiornaPassword(id_utente, vecchiaPassword, nuovaPassword){
        const utente = await User.findById(id_utente);
        if(!utente) {
            throw new Error('Utente non trovato');
        }
        const ok = await User.comparePassword(vecchiaPassword, utente.password);
        if(!ok) {
            throw new Error('Vecchia password non corretta');
        }
        const password = await User.aggiornaPasswordHash(id_utente, nuovaPassword);
        if(!password){
            throw new Error('Errore nell\'aggiornamento della password');
        }
        return password;
    };

    static async eliminaEta(id_utente){
        const eliminato = await User.eliminaEta(id_utente);
        if(!eliminato){
            return null;
        }
        return eliminato;
    };

    static async annullaAssociazione(id_associazione) {
        const annullata = await User.annullaAssociazione(id_associazione);
        if(!annullata) {
            throw new Error('Errore nell\'annullamento dell\'associazione');
        }
        return annullata;
    };

    static async annullaRichiesta(id_richiesta) {
        const annullata = await User.annullaRichiesta(id_richiesta);
        if(!annullata) {
            throw new Error('Errore nell\'annullamento della richiesta');
        }
        return annullata;
    };
}
module.exports = UserServices;