const Bacheca = require('../models/bacheca');

class BachecaServices {

    static async getPastiBacheca() {
        const pasti = await Bacheca.getPastiBacheca();
        if(pasti && pasti.length > 0) {
            return pasti;
        } else {
            console.log('Nessun pasto nella bacheca');
            return [];
        }
    }

    static async getAllenamentiBacheca() {
        const allenamenti = await Bacheca.getAllenamentiBacheca();
        if(allenamenti && allenamenti.length > 0) {
            return allenamenti;
        } else {
            console.log('Nessun allenamento nella bacheca');
            return [];
        }
    }

    static async getSingolaAttivitaBacheca(id_attivita, tipologia_attivita) {
        const attivita = await Bacheca.getSingolaAttivitaBacheca(id_attivita, tipologia_attivita);
        if(attivita) {
            return attivita;
        } else {
            console.log('Nessuna attività trovata con questo id e questa tipologia');
            return null;
        }
    }

    static async getVotiAttivita(id_attivita, tipologia_attivita) {
        const voti = await Bacheca.getVotiAttivita(id_attivita, tipologia_attivita);
        if(voti && voti.length > 0) {
            return voti;
        } else {
            console.log('Nessun voto trovato');
        }
        return [];
    };

    static async condividiAttivita(id_utente, id_attivita, tipologia_attivita) {
        const condivisa = await Bacheca.condividiAttivita(id_utente, id_attivita, tipologia_attivita);
        if(condivisa) {
            console.log('Attività condivisa con successo');
        } else {
            console.log('Errore nella condivisione dell\'attività');
        }
        return condivisa;
    }

    static async votaAttivita(id_utente, attivita) {
        const votata = await Bacheca.votaAttivita(id_utente, attivita);
        if(votata) {
            console.log('Attività votata con successo');
        } else {
            console.log('Errore nella votazione dell\'attività');
        }
        return votata;
    };
}
module.exports = BachecaServices;