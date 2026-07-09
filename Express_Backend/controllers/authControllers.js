const AuthServices = require('../services/authServices');

class AuthControllers {

    static login = async (req, res) => {
        const {email, password} = req.body;
        try {
            const result = await AuthServices.login(email, password);
            return res.status(result.status).json({message: result.message, token: result.token});
        } catch(e){
            res.status(e.status || 500).json({error: e.message});
        }
    };

    static register = async (req, res) => {
        const {ruolo, id_ruolo_professionista, nome, cognome, email, password} = req.body;
        try {
            const result = await AuthServices.registration(ruolo, id_ruolo_professionista, nome, cognome, email, password);
            res.status(201).json({success: true, data: result});
        } catch (e) {
            res.status(e?.status || 400).json({success: false, message: e.message});
        }
    };

    static getRuoliProfessionisti = async (req, res) => {
        try {
            const result = await AuthServices.getRuoliProfessionisti();
            res.status(201).json(result);
        } catch (e) {
            res.status(400).json({ success: false, message: e.message });
        }
    };
}
module.exports = AuthControllers;