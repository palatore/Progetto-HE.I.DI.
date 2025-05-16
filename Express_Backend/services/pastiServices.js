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

}

module.exports = PastiServices;