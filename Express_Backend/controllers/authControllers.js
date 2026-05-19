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
        const {ruolo, nome, cognome, email, password} = req.body;
        try {
            console.log("invio questi dati:", req.body);
            const result = await AuthServices.registration(ruolo, nome, cognome, email, password);
            res.status(201).json({success: true, data: result});
        } catch (e) {
            console.log(e.status);
            res.status(400).json({success: false, message: e.message});
        }
    }
}
module.exports = AuthControllers;