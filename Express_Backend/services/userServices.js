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

    static async getDietologi() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM utenti WHERE ruolo = "dietologo"', [], (err, rows) => {
                if (err) {
                   reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };
}

module.exports = UserServices;