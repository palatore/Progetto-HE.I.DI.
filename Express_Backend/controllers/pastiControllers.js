const PastiServices = require('../services/pastiServices');

class PastiControllers {

    static getAlimenti = async (req, res) => {
        try {
            const alimenti = await PastiServices.getAllAlimenti();
            res.json(alimenti);
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static getPasti = async (req, res) => {
        try {
            const pasti = await PastiServices.getAllPasti();
            res.json(pasti);
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    }

}
module.exports = PastiControllers;