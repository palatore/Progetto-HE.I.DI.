const db = require('../db.js');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const CHIAVE_SEGRETA = 'kingdomhearts';

class Authservices {

    static async login(email, password) {
        try {
            const user = await User.findByEmail(email);
            if (!user) {
                throw new Error('Credenziali non valide');
            }
            // check se la password è corretta
            const isMatch = await User.comparePassword(password, user.password);
            if (!isMatch) {
                if(password !== user.password) {
                    throw new Error('no');
                }
            }
            const token = jwt.sign(
                {id: user.id, email: user.email, ruolo: user.ruolo},
                CHIAVE_SEGRETA,
                {expiresIn: '2h'}
            );
            return {status:201, message:'Login avvenuto con successo', token};
        } catch (e) {
            throw {status:401, message:"Credenziali non valide"};
        }
    }

    static async registration(ruolo, nome, cognome, email, password) {
        try {
            const user = User.findByEmail(email);
            if(user) {
                throw new Error('Email già in uso');
            }

            return await User.create(nome, cognome, email, password, ruolo);
        } catch(e) {
            throw e;
        }
    }

}

module.exports = Authservices;