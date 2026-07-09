const db = require('../db.js');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const CHIAVE_SEGRETA = 'kingdomhearts';

class Authservices {

    static async login(email, password) {
        try {
            const user = await User.findByEmail(email);
            if (!user) {
                throw {status:401, message:"Credenziali non valide"}
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

    static async registration(ruolo, id_ruolo_professionista, nome, cognome, email, password) {
        try {
            const dati =  { ruolo, id_ruolo_professionista, nome, cognome, email, password};

            const userExists = await User.findByEmail(email);
            if (userExists) {
                throw new Error('Email già in uso');
            }

            const user = await User.create({
                nome,
                cognome,
                email,
                password,
                ruolo
            });

            if (Number(ruolo) > 0 && id_ruolo_professionista) {
                await User.iscriviProfessionista(user.id, id_ruolo_professionista);
            }

            return user;
        }   catch (e) {
                throw e;
        }
    }

    static async getRuoliProfessionisti() {
        return await User.getRuoliProfessionisti();
    }

}

module.exports = Authservices;