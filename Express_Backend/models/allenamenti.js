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

    static async getEsercizioById(id_esercizio){
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM esercizi WHERE id = ?', [id_esercizio], (err, row) =>{
                if (err){
                    reject(err);
                }else{
                    resolve(row);
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


    //metodo per trovare gli allenamenti grazie al loro ID
    static async findAllenamentiById(id_allenamento){
        return new Promise((resolve, reject) =>{
            db.all('SELECT * FROM allenamenti WHERE id = ?', [allenamento], (err, rows) =>{
                if(err){
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    //metodo per ottenere tutti gli esercizi all'interno di un allenamento
    static async getAllEserciziAllenamento() {
        return new Promise((resolve, reject) =>{
            db.all('SELECT * FROM esercizi_allenamento', [], (err, rows) => {
                if(err){
                    reject(err);
                } else{
                    resolve(rows);
                };
            });
        });
    }

    //metodo per ottenere i dettagli di un allenamento
    static async getDettagliAllenamento(id_allenamento, allenamento){
        return new Promise((resolve, reject) => {
            db.all('SELECT ea.*, a.name FROM esercizi_allenamento ea JOIN esercizi e ON ea.esercizio_id = e.id WHERE ea.allenamento_id = ?', [id_allenamento], (err, esercizi)=>{
                if(err){
                    reject(err);
                } else {
                    db.get('SELECT * FROM esercizi_allenamento ea JOIN esercizi e ON ea.esercizio_id = e.id WHERE ea.allenamento_id = ?', [id_allenamento], (err, rows)=>{
                        if(err){
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                    });
                }
            });
        });
    }


    //metodo per ottenere gli allenamenti di un utente
    static async getAllenamentiUtente(user_id) {
        return new Promise((resolve, reject)=>{
            db.all('SELECT * FROM allenamenti a WHERE a.user_id = ? ORDER BY data', [user_id], (err, rows)=>{
                if(err){
                    reject(err);
                } else{
                    resolve(rows);
                };
            });
        });
    }

    //metodo per evitare allenamenti duplicati
    static async checkAllenamento(user_id, giorno) {
        console.log('Model, giorno è:', giorno);
        console.log('Model giorno è di tipo:', typeof(giorno));
        return new Promise((resolve, reject)=> {
            db.all('SELECT * FROM allenamenti WHERE user_id = ? AND data = ?', [user_id, giorno], (err, rows)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(rows.length > 0);
                };
            });
        });
    }

    //metodo per creare allenamenti
    static async creaAllenamenti(user_id, nome, giorno, durata, data){
        return new Promise((resolve, reject)=>{
            db.run('INSERT INTO allenamenti (user_id, name, data, durata, data_creazione) VALUES (?, ?, ?, ?, ?)', [user_id, nome, giorno, durata, data], function(err){
                if(err){
                    reject(err);
                } else {
                    resolve({lastID: this.lastID});
                }
            });
        });
    }

    //metodo per riempire un allenamento
    static async riempiAllenamento(id_allenamento, esercizi){
        return new Promise((resolve, reject)=> {
            const insertAllenamenti = allenamenti.map(allenamento =>{
                console.log('sto inserendo allenamento:', esercizio, esercizio.id, 'con:', esercizio.reps, 'ripetizioni,', esercizio.kg, 'kg, e', esercizio.rest, 'minuti di riposo');
                return new Promise((res, rej)=>{
                    db.run('INSERT INTO esercizi_allenamento (allenamento_id, esercizio_id, ripetizioni, pesi_kg, riposo_minuti) VALUES (?, ?, ?, ?, ?)', [id_allenamento, esercizio.id, esercizio.reps, esercizio.kg, esercizio.rest], function(err){
                        if(err){
                            rej(err);
                        } else {
                            res(this.lastID);
                        }
                    });
                });
            });

            Promise.all([insertAllenamenti])
            .then(results => resolve({message: 'Allenamento riempito con successo', id_allenamento, esercizi}))
            .catch(err => reject(err));
        });
    }

    //metodo per eliminare un allenamento
    static async eliminaAllenamento(id_allenamento){
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM esercizi_allenamento WHERE allenamento_id = ?', [id_allenamento], function(err) {
                if(err){
                    reject(err);
                } else {
                    db.run('DELETE FROM allenamenti WHERE id = ?', [id_allenamento], function(err) {
                        if(err){
                            reject(err);
                        } else if(this.changes === 0) {
                            resolve({message: 'Nessun allenamento trovato con questo ID'});
                        } else {
                            resolve({message: 'Allenamento eliminato con successo'});
                        }
                    });
                }
            });
        });
    }
}

module.exports = Allenamenti; 