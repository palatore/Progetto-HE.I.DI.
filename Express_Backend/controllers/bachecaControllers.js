const BachecaServices = require('../services/bachecaServices');

class BachecaControllers {

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
