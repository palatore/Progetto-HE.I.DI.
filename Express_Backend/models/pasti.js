const db = require('../db.js');

//Interagisce direttamente con il database per le operazioni CRUD sui pasti

class Pasti {

    static async getAllAlimenti() {
        return new Promise((resolve, reject) => {
            console.log('Sto eseguendo la query per ottenere tutti gli alimenti');
            db.all('SELECT * FROM alimenti', [], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async getAllPasti() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM pasti', [], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async findPastoById(id_pasto) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM pasti WHERE id = ?', [id_pasto], (err, row) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    };

    static async getAllAlimentiPasti() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM alimenti_pasto', [], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async getDettagliPasto(id_pasto, pasto) {
        return new Promise((resolve, reject) => {
            db.all('SELECT ap.*, a.name, a.kcal FROM alimenti_pasto ap JOIN alimenti a ON ap.alimento_id = a.id WHERE ap.pasto_id = ?', [id_pasto], (err, alimenti) => {
                if(err) {
                    reject(err);
                } else {
                    db.get('SELECT SUM(a.kcal * ap.quantita / 100) AS tot_kcal FROM alimenti_pasto ap JOIN alimenti a ON ap.alimento_id = a.id WHERE ap.pasto_id = ?', [id_pasto], (err, result) => {
                        if(err) {
                            reject(err);
                        } else {
                            const dettagliPasto = { ...pasto, alimenti, totCalorie: result.tot_kcal || 0 };
                            resolve(dettagliPasto);
                        }
                    });
                }
            });
        });
    }

    static async getPastiUtente(user_id) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM pasti p WHERE p.user_id = ? ORDER BY data', [user_id], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async checkPasto(user_id, nome, data, tipo) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM pasti WHERE user_id = ? AND name = ? AND data = ? AND tipo = ?', [user_id, nome, data, tipo], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows.length > 0);
                }
            });
        });
    }

    static async creaPasti(user_id, nome, data, tipo) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO pasti (user_id, name, data, tipo) VALUES (?, ?, ?, ?)', [user_id, nome, data, tipo], function(err) {
                if(err) {
                    reject(err);
                } else {
                    resolve({lastID: this.lastID});
                }
            });
        });
    }

    static async riempiPasto(id_pasto, alimenti) {
    return new Promise((resolve, reject) => {
            const insertAlimenti = alimenti.map(alimento => {
                console.log('sto inserendo alimento:', alimento, alimento.id, 'con quantità:', alimento.qta);
                return new Promise((res, rej) => {
                    db.run('INSERT INTO alimenti_pasto (pasto_id, alimento_id, quantita) VALUES (?, ?, ?)', [id_pasto, alimento.id, alimento.qta], function(err) {
                        if(err) {
                            rej(err);
                        } else {
                            res(this.lastID);
                        }
                    });
                });
            });

            Promise.all([insertAlimenti])
                .then(results => resolve({message: 'Pasto riempito con successo', id_pasto, alimenti}))
                .catch(err => reject(err));
        });
    }

    static async eliminaPasto(id_pasto) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM alimenti_pasto WHERE pasto_id = ?', [id_pasto], function(err) {
                if(err) {
                    reject(err);
                } else {
                    db.run('DELETE FROM pasti WHERE id = ?', [id_pasto], function(err) {
                        if(err) {
                            reject(err);
                        } else if (this.changes === 0) {
                            resolve({message: 'Nessun pasto trovato con questo ID'});
                        } else {
                            resolve({message: 'Pasto eliminato con successo'});
                        }
                    });
                }
            });
        });
    }
} 

module.exports = Pasti;