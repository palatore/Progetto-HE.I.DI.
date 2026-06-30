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
            if(utenti && utenti.lenght > 0) {
                console.log('Lista utenti ottenuta:', utenti);
                return utenti;
            } else {
                console.log('Nessun utente con quel ruolo');
                return [];
            }
        } else if(ruolo == 3) {
            console.log('Chiamo il Model per ottenere tutti gli utenti professionsti');
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

    static async getAssociazioniUtente(id_utente) {
        const associazioni = await User.getAssociazioniUtente(id_utente);
        if(associazioni && associazioni.lenght > 0) {
            console.log('Lista ottentuta:', associazioni);
            return associazioni;
        } else {
            console.log('Nessuna associazione con utenti trovata');
            return [];
        }
    }

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
}

module.exports = UserServices;