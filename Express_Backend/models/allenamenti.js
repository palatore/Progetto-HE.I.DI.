const db = require('../db.js');

//Interagisce direttamente col database per le operazioni CRUD sugli allenamenti

class Allenamenti {

    //metodo per ottenere tutti gli esercizi
    static async getAllEsercizi(){
        return new Promise((resolve, reject) => {
            console.log('Eseguo la query di ottenimento di TUTTI gli esercizi');
            db.all('SELECT * FROM esercizi', [], (err, rows) => {
                if(err){
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    //metodo per ottenere tutti gli allenamenti
    static async getAllAllenamenti(){
        return new Promise((resolve, reject) => {
            console.log('Eseguo la query di ottenimento di TUTTI gli allenamenti');
            db.all('SELECT * FROM allenamenti', [], (err, rows) => {
                if(err){
                    reject(err);
                }else{
                    resolve(rows);
                }
            });
        });
    }


    //metodo per trovare gli esercizi grazie al loro ID
    static async findEserciziById(){
        // da completare
    }
} 