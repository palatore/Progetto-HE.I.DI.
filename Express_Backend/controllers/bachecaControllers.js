const BachecaServices = require('../services/bachecaServices');

class BachecaControllers {

    static getPastiBacheca = async (req, res) => {
        try {
            const result = await BachecaServices.getPastiBacheca();
            if(result) {
                console.log('Pasti della bacheca in arrivo', result);
                res.json(result);
            } else {
                res.status(404).json({error: 'Nessun pasto'});
            }
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static getAllenamentiBacheca = async (req, res) => {
        try {
            const result = await BachecaServices.getAllenamentiBacheca();
            if(result) {
                console.log('Allenamenti della bacheca in arrivo', result);
                res.json(result);
            } else {
                res.status(404).json({error: 'Nessun allenamento'});
            }
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static getSingolaAttivitaBacheca = async (req, res) => {
        try {
            const id_attivita = req.query.id_attivita;
            const tipologia_attivita = req.query.tipologia_attivita;
            const result = await BachecaServices.getSingolaAttivitaBacheca(id_attivita, tipologia_attivita);
            if(result) {
                console.log('Attività in arrivo:', result);
                res.status(201).json({result});
            } else {
                res.status(404).json({error: 'Nessuna attività'});
            }
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    };

    static getVotiAttivita = async (req, res) => {
        try {
            const id_attivita = req.query.id_attivita;
            const tipologia_attivita = req.query.tipologia_attivita;
            const result = await BachecaServices.getVotiAttivita(id_attivita, tipologia_attivita);
            if(result) {
                console.log('Voti in arrivo:', result);
                res.json(result);
            } else {
                res.status(404).json({error: 'Nessun voto'});
            }
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static condividiAttivita = async (req, res) => {
        try {
        const id_utente = req.user.id;
        const { id_attivita, tipologia_attivita } = req.body;
        const result = await BachecaServices.condividiAttivita(id_utente, id_attivita, tipologia_attivita);
            res.status(201).json({message: 'Attività condivisa con successo', result});
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };

    static votaAttivita = async (req, res) => {
        try {
            const id_utente = req.user.id;
            const { attivita } = req.body;
            const result = await BachecaServices.votaAttivita(id_utente, attivita);
            res.status(201).json({message: 'Voto piazzato con successo', result});
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    };
}
module.exports = BachecaControllers;
