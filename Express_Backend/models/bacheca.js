const db = require('../db.js');

class Bacheca {

    static async getPastiBacheca() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT 
                        b.id, 
                        b.id_attivita, 
                        b.tipologia_attivita, 
                        b.data_condivisione,
                        p.name AS nome_pasto,
                        p.tipo,
                        u.name AS nome_autore,
                        u.surname AS cognome_autore
                    FROM bacheca b INNER JOIN pasti p ON b.id_attivita = p.id INNER JOIN utenti u ON b.id_utente_condivisore = u.id
                    WHERE b.tipologia_attivita = 0 AND b.data_condivisione >= NOW() - INTERVAL 1 DAY`, (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async getAllenamentiBacheca() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT 
                        b.id, 
                        b.id_attivita, 
                        b.tipologia_attivita, 
                        b.data_condivisione,
                        a.name AS nome_allenamento,
                        p.tipo,
                        u.name AS nome_autore,
                        u.surname AS cognome_autore
                    FROM bacheca b INNER JOIN allenamenti a ON b.id_attivita = a.id INNER JOIN utenti u ON b.id_utente_condivisore = u.id
                    WHERE b.tipologia_attivita = 1 AND b.data_condivisione >= NOW() - INTERVAL 1 DAY`, (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }



    static async getVotiAttivita(id_attivita, tipologia_attivita) {
        return new Promise((resolve, reject) => {
            db.all('SELECT voto FROM voti WHERE id_attivita = ? AND tipologia_attivita = ?', [id_attivita, tipologia_attivita], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async votaAttivita(id_utente, attivita) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO voti (id_attivita, tipologia_attivita, id_votante, voto) VALUES (?, ?, ?, ?)', [attivita.id, attivita.tipologia, id_utente, attivita.valutazione], function(err) {
                if(err) {
                    reject(err);
                } else {
                    resolve({lastID: this.lastID});
                }
            });
        });
    }

}
module.exports = Bacheca;