const db = require('../db.js');
const User = require('../models/user');

class UserServices {

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
}

module.exports = UserServices;