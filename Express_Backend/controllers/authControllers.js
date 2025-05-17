const Authservices = require('../services/authServices');
const AuthServices = require('../services/authServices');

class AuthControllers {

    static async login(req, res){
        const {email, password} = req.body;
        try {
            const result = await AuthServices.login(email, password);
            return res.status(result.status).json({message: result.message, token: result.token});
        } catch(e){
            res.status(e.status || 500).json({error: e.message});
        }
    }

    static async register(req, res) {
        const {ruolo, email, nome, cognome, password} = req.body;
        try {
            const result = await Authservices.registration(ruolo, email, nome, cognome, password);
            res.status(201).json({success: true, data: result});
        } catch (e) {
            res.status(400).json({success: false, message: e.message});
        }
    }
}
module.exports = AuthControllers;