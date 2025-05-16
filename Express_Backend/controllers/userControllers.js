const UserServices = require('../services/userServices');

class UserControllers {

    static getUsers = async (req, res) => {
        try {
            const utenti = await UserServices.getAllUsers();
            res.json(utenti);
        } catch(e) {
            res.status(500).json({error: e.message});
        }
     };

     static getDietologi = async (req, res) => {
        try {
            const dietologi = await UserServices.getDietologi();
            res.json(dietologi);
        } catch(e) {
            res.status(500).json({error: e.message});

        }
     }

}
module.exports = UserControllers;