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
}
module.exports = AuthControllers;