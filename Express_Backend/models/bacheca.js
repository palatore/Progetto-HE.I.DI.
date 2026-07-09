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
                    WHERE b.tipologia_attivita = 0 AND b.data_condivisione >= datetime('now', '-1 day')`, (err, rows) => {
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
                        a.durata,
                        u.name AS nome_autore,
                        u.surname AS cognome_autore
                    FROM bacheca b INNER JOIN allenamenti a ON b.id_attivita = a.id INNER JOIN utenti u ON b.id_utente_condivisore = u.id
                    WHERE b.tipologia_attivita = 1 AND b.data_condivisione >= datetime('now', '-1 day')`, (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async getSingolaAttivitaBacheca(id_utente, id_attivita, tipologia_attivita) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM bacheca WHERE id_utente_condivisore = ? AND id_attivita = ? AND tipologia_attivita = ?', [id_utente, id_attivita, tipologia_attivita], (err, row) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(row);
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

    static async condividiAttivita(id_utente, id_attivita, tipologia_attivita) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO bacheca (id_utente_condivisore, id_attivita, tipologia_attivita) VALUES (?, ?, ?)', [id_utente, id_attivita, tipologia_attivita], function(err) {
                if(err) {
                    reject(err);
                } else {
                    resolve({lastID: this.lastID});
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