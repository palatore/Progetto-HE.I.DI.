const Bacheca = require('../models/bacheca');

class BachecaServices {

    static async getVotiAttivita(id_attivita, tipologia_attivita) {
        const voti = await Bacheca.getVotiAttivita(id_attivita, tipologia_attivita);
        if(voti) {
            return voti;
        } else {
            console.log('Nessun voto trovato');
            return null;
        }
    };

    static async votaAttivita(id_utente, attivita) {
        const votata = await Bacheca.votaAttivita(id_utente, attivita);
        if(votata) {
            console.log('Attivita votata con successo');
        } else {
            console.log('Errore nella votazione dell\'attivita');
        }
        return votata;
    };
}
module.exports = BachecaServices;