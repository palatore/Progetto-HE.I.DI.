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

    static async getAlimentoById(id_alimento) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM alimenti WHERE id = ?', [id_alimento], (err, row) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(row);
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
            db.all('SELECT ap.*, a.* FROM alimenti_pasto ap JOIN alimenti a ON ap.alimento_id = a.id WHERE ap.pasto_id = ?', [id_pasto], (err, alimenti) => {
                if(err) {
                    reject(err);
                } else {
                    const dettagliPasto = { ...pasto, alimenti};
                    resolve(dettagliPasto);
                }
            });
        });
    }

    static async getPastiUtente(user_id) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM pasti p WHERE p.user_id = ?', [user_id], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async checkPasto(user_id, nome, tipo) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM pasti WHERE user_id = ? AND name = ? AND tipo = ?', [user_id, nome, tipo], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows.length > 0);
                }
            });
        });
    }

    static async creaPasti(user_id, nome, tipo, data_creazione) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO pasti (user_id, name, tipo, data_creazione) VALUES (?, ?, ?, ?)', [user_id, nome, tipo, data_creazione], function(err) {
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
                console.log('sto inserendo alimento:', alimento, alimento.id_dettaglio, 'con quantità:', alimento.quantita);
                return new Promise((res, rej) => {
                    db.run('INSERT INTO alimenti_pasto (pasto_id, alimento_id, quantita) VALUES (?, ?, ?)', [id_pasto, alimento.id_dettaglio, alimento.quantita], function(err) {
                        if(err) {
                            reject(err);
                        } else {
                            resolve(this.lastID);
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

    static async eliminaDettagliPasto(id_pasto) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM alimenti_pasto WHERE pasto_id = ?', [id_pasto], function(err) {
                if(err) {
                    reject(err);
                } else {
                    resolve({message: 'Dettagli pasto eliminati con successo.'});
                }
            });
        });
    }
} 

module.exports = Pasti;