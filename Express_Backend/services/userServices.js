const db = require('../db.js');
const User = require('../models/user');

class UserServices {

    static async getUtenteById(id_utente){
        const dati = await User.findById(id_utente);
        if(!dati){
            console.log('Da Service: nessun utente con ID:', id_utente);
            return null;
        }else{
            console.log('Da Service: Dati trovati:', dati);
        }
        return dati;
    };

    static async getInfoUtenteById(id_utente){
        console.log('SERVICE: ricevo e passo:',id_utente);
        const info = await User.findInfo(id_utente);
        if(!info){
            console.log('SERVICE: nessuna info con id:', id_utente);
            return null;
        }else{
            console.log('SERVICE: Info recuperate:', info);
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
            console.log('Chiamo il Model per ottenere gli utenti con un determinato ruolo');
            const utenti = await User.getUtentiByRuolo(ruolo);
            if(utenti && utenti.length > 0) {
                console.log('Lista utenti ottenuta:', utenti);
                return utenti;
            } else {
                console.log('Nessun utente con quel ruolo');
                return [];
            }
        } else if(ruolo == 3) {
            console.log('Chiamo il Model per ottenere tutti gli utenti professionisti');
            const professionisti = await User.getProfessionisti();
            if(professionisti) {
                console.log('Lista professionisti ottenuta:', professionisti);
                return professionisti;
            } else {
                console.log('Nessun professionista trovato');
                return [];
            }
        } else {
            console.log('Ruolo non valido.');
        }
    };

    static async getAlbo() {
        const albo = await User.getAlbo();
        if(albo && albo.length > 0) {
            console.log('Lista albo ottenuta:', albo);
            return albo;
        } else {
            console.log('Nessun albo trovato');
            return [];
        }
    };

    static async getRichieste() {
        const richieste = await User.getRichieste();
        if(richieste && richieste.length >0) {
            return richieste;
        } else {
            console.log('richieste non trovate');
            return [];
        }
    };

    static async getRuoloProfessionista(id_professionista) {
        const ruolo = await User.getRuoloProfessionista(id_professionista);
        if(ruolo) {
            console.log('Ruolo ottenuto:', ruolo);
            return ruolo;
        } else {
            console.log('Nessun ruolo trovato per il professionista con ID:', id_professionista);
            return null;
        }
    };

    static async getAssociazioniUtente(id_utente) {
        const associazioni = await User.getAssociazioniUtente(id_utente);
        if(associazioni && associazioni.length > 0) {
            console.log('Lista ottenuta:', associazioni);
            return associazioni;
        } else {
            console.log('Nessuna associazione con utenti trovata');
            return [];
        }
    };

    static async getAssociazioniProfessionista(id_professionista) {
        const associazioni = await User.getAssociazioniProfessionista(id_professionista);
        if(associazioni && associazioni.length > 0) {
            console.log('Lista ottenuta:', associazioni);
            return associazioni;
        } else {
            console.log('Nessuna associazione con professionisti trovata');
            return [];
        }
    };

    static async getRichiesteUtente(id_utente) {
        const richieste = await User.getRichiesteUtente(id_utente);
        if(richieste && richieste.length > 0) {
            console.log('Lista ottenuta:', richieste);
            return richieste;
        } else {
            console.log('Nessuna richiesta trovata');
            return [];
        }
    };

    static async getRichiesteProfessionista(id_professionista) {
        const richieste = await User.getRichiesteProfessionista(id_professionista);
        if(richieste && richieste.length > 0) {
            console.log('Lista ottenuta:', richieste);
            return richieste;
        } else {
            console.log('Nessuna richiesta trovata');
            return [];
        }
    };

static async getAssociazioniPending(id_utente) {
        const associazioni = await User.getAssociazioniPending(id_utente);
        if(associazioni && associazioni.length > 0) {
            console.log('Lista ottenuta:', associazioni);
            return associazioni;
        } else {
            console.log('Nessuna associazione pending trovata');
            return [];
        }
    };

    static async getRichiestePending(id_utente) {
        const richieste = await User.getRichiestePending(id_utente);
        if(richieste && richieste.length > 0) {
            console.log('Lista ottenuta:', richieste);
            return richieste;
        } else {
            console.log('Nessuna richiesta pending trovata');
            return [];
        }
    };

    static async creaAssociazione(id_utente, id_persona) {
        const associazione = await User.creaAssociazione(id_utente, id_persona);
        if(associazione) {
            console.log('Associazione creata con successo');
        } else {
            console.log('Errore nella creazione dell\'associazione');
        }
        return associazione;
    };

    static async accettaAssociazione(id_associazione) {
        const accettata = await User.accettaAssociazione(id_associazione);
        if(accettata) {
            console.log('Associazione accettata con successo');
        } else {
            console.log('Errore nell\'accettazione dell\'associazione');
        }
        return accettata;
    };

    static async creaRichiesta(id_utente, dati) {
        const creata = await User.creaRichiesta(id_utente, dati);
        if(creata) {
            console.log('Richiesta creata con successo');
        } else {
            console.log('Errore nella creazione della richiesta');
        }
        return creata;
    };

    static async accettaRichiesta(richiesta) {
        const id_richiesta = richiesta.id;
        const tipo = richiesta.tipo;
        if(tipo === 'MODIFICA') {
            const accettata = await User.accettaRichiesta(id_richiesta, 'MODIFICATA');
            if(accettata) {
                console.log('Richiesta accettata con successo');
            } else {
                console.log('Errore nell\'accettazione della richiesta');
            }
            return accettata;
        } else if(tipo === 'VOTO') {
            const accettata = await User.accettaRichiesta(id_richiesta, 'VOTATA');
            if(accettata) {
                console.log('Richiesta accettata con successo');
            } else {
                console.log('Errore nell\'accettazione della richiesta');
            }
            return accettata;
        }
    };

    static async creaInfo(id_utente){
        const info = await User.creaInfo(id_utente);
        if(info){
            console.log('Info create con successo');
        }else{
            console.log('Errore nella creazione delle indfo');
        }
        return info;
    }

    static async riempiInfo(info){
        const nuoveInfo = await User.riempiInfo(info);
        if(nuoveInfo){
            console.log('Info aggiornate con successo');
        }else{
            console.log('Errore nell\'inserimento delle info');
        }
        return nuoveInfo;
    }

    static async aggiornaPassword(id_utente, nuovaPassword){
        const password = await User.aggiornaPassword(id_utente, nuovaPassword);
        if(password){
            console.log('Password aggiornata con successo');
        }else{
            console.log('Errore nell\'aggiornamento della password');
        }
        return password;
    };

    static async eliminaEta(id_utente){
        console.log('SERVICE elimina età riceve e manda:', id_utente);
        const eliminato = await User.eliminaEta(id_utente);
        if(eliminato){
            console.log('SERVICE obiettivo eliminato');
        }else{
            console.log('SERVICE obiettivo ancora in vita');
        }
        return eliminato;
    };

    static async annullaAssociazione(id_associazione) {
        const annullata = await User.annullaAssociazione(id_associazione);
        if(annullata) {
            console.log('Associazione annullata con successo');
        } else {
            console.log('Errore nell\'annullamento dell\'associazione');
        }
        return annullata;
    };

    static async annullaRichiesta(id_richiesta) {
        const annullata = await User.annullaRichiesta(id_richiesta);
        if(annullata) {
            console.log('Richiesta annullata con successo');
        } else {
            console.log('Errore nell\'annullamento della richiesta');
        }
        return annullata;
    };
}
module.exports = UserServices;