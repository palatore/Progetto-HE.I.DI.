const Bacheca = require('../models/bacheca');

class BachecaServices {

    static async getPastiBacheca() {
        const pasti = await Bacheca.getPastiBacheca();
        if(!(pasti && pasti.length > 0)) {
            console.log('Nessun pasto nella bacheca');
            return [];
        }
        return pasti;
    }

    static async getAllenamentiBacheca() {
        const allenamenti = await Bacheca.getAllenamentiBacheca();
        if(!(allenamenti && allenamenti.length > 0)) {
            return [];
        }
        return allenamenti;
    }

    static async getSingolaAttivitaBacheca(id_utente, id_attivita, tipologia_attivita) {
        const attivita = await Bacheca.getSingolaAttivitaBacheca(id_utente, id_attivita, tipologia_attivita);
        if(!attivita) {
            return null;
        }
        return attivita;
    }

    static async getVotiAttivita(id_attivita, tipologia_attivita) {
        const voti = await Bacheca.getVotiAttivita(id_attivita, tipologia_attivita);
        if(!(voti && voti.length > 0)) {
            console.log('Nessun voto trovato');
            return [];
        } 
        return voti;
    };

    static async condividiAttivita(id_utente, id_attivita, tipologia_attivita) {
        const condivisa = await Bacheca.condividiAttivita(id_utente, id_attivita, tipologia_attivita);
        if(!condivisa) {
            throw new Error('Errore nella condivisione dell\'attività');
        }
        return condivisa;
    }

    static async votaAttivita(id_utente, attivita) {
        const votata = await Bacheca.votaAttivita(id_utente, attivita);
        if(votata) {
            throw new Error('Errore nella votazione dell\'attività');
        }
        return votata;
    };
}
module.exports = BachecaServices;