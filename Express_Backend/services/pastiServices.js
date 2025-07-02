const db = require('../db.js');

class PastiServices {

    static async getAllAlimenti() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM alimenti', [], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
        
    };

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
    };

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
            db.all('SELECT * FROM pasti WHERE user_id = ? AND nome = ? AND data = ? AND tipo = ?', [user_id, nome, data, tipo], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows.length > 0);
                }
            });
        });
    };

    static async creaPasti(user_id, nome, data, tipo) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO pasti (user_id, nome, data, tipo) VALUES (?, ?, ?, ?)', [user_id, nome, data, tipo], function(err) {
                if(err) {
                    reject(err);
                } else {
                    resolve({lastID: this.lastID});
                }
            });
        });
    };

    static async riempiPasto(id_pasto, alimenti, bevande) {
        console.log('RiempiPasto service chiamato');
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

            const insertBevande = bevande.map(bevanda => {
                return new Promise((res, rej) => {
                    db.run('INSERT INTO alimenti_pasto (pasto_id, bevanda_id, quantita) VALUES (?, ?, ?)', [id_pasto, bevanda.id, bevanda.qta], function(err) {
                        if(err) {
                            rej(err);
                        } else {
                            res(this.lastID);
                        }
                    });
                });
            });

            Promise.all([...insertAlimenti, ...insertBevande])
                .then(results => resolve({message: 'Pasto riempito con successo', id_pasto, alimenti, bevande}))
                .catch(err => reject(err));
        });
    }

}

module.exports = PastiServices;