const db = require('../db.js');

//importo il modulo bcryptjs per la gestione delle password
const bcrypt = require('bcryptjs');


//Interagisce direttamente con il database per le operazioni CRUD sugli utenti
class User {
  
// definisco il metodo per creare un nuovo utente
  static async create({ nome, cognome, email, password, ruolo}) {
    // genSalt genera un seed casuale per l'hashing della password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO utenti (name, surname, email, password, ruolo) VALUES (?, ?, ?, ?, ?)',
        [nome, cognome, email, hashedPassword, ruolo],
        function(err) {
          if (err) reject(err);
          db.get('SELECT last_insert_rowid() as id', (err2, row) => {
          if (err2) return reject(err2);
          resolve({ id: row.id, nome, cognome, email, ruolo });
          });
        }
      );
    });
  }

// definisco il metodo per trovare un utente in base all'username
  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM utenti WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

// ricerca per id
  static async findById(id_utente) {
    return new Promise((resolve, reject) => {
      db.get('SELECT id, name, surname, email FROM utenti WHERE id = ?', [id_utente], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static async findInfo(id_utente){
    console.log('MODEL: cerco con id:', id_utente);
    return new Promise((resolve, reject)=>{
      db.get('SELECT id_utente, eta, altezza_cm, peso_kg, condizioni_mediche, id_P1, professionista1, id_P2, professionista2 FROM profilo_utente WHERE id_utente = ?', [id_utente], (err, row) =>{
        if(err) reject(err);
        else resolve(row);
      });
    })
  }

  //ricerca per ruolo
  static async getUtentiByRuolo(ruolo){
    return new Promise((resolve, reject) => {
      db.get('SELECT id, name, surname, email, ruolo FROM utenti WHERE ruolo = ?', [ruolo], (err, rows) => {
        if(err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async getAlbo() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM albo_professionisti', (err, rows) => {
        if(err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getProfessionisti() {
    return new Promise((resolve, reject) => {
      db.all('SELECT id, name, surname, email, ruolo FROM utenti WHERE ruolo > 0', (err, rows) => {
        if(err){
          reject(err);
        } else {
          console.log('ecco cosa ho trovato: ', rows);
          resolve(rows);
        }
      });
    });
  }

  static async getRuoloProfessionista(id_professionista) {
    return new Promise((resolve, reject) => {
      db.get('SELECT rp.ruolo FROM albo_professionisti ap JOIN ruoli_professionisti rp ON ap.id_ruolo = rp.id WHERE ap.id_professionista = ?', [id_professionista], (err, row) => {
        if(err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async getAssociazioniUtente(id_utente) {
    return new Promise((resolve, reject) => {
      db.all('SELECT a.id_professionista, u.name AS nome_P, u.surname AS cognome_P, a.stato FROM associazioni a JOIN utenti u ON a.id_professionista = u.id WHERE a.id_paziente = ?', [id_utente], (err, rows) => {
        if(err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getRichiestePending(id_professionista) {
    return new Promise((resolve, reject) => {
      db.all('SELECT a.id, u.name, u.surname, u.email, a.stato FROM associazioni a JOIN utenti u ON a.id_paziente = u.id WHERE a.id_professionista = ? AND stato = "PENDING"', [id_professionista], (err, rows) => {
        if(err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  
  static async creaAssociazione(id_utente, id_persona) {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO associazioni (id_paziente, id_professionista) VALUES (?, ?)', [id_utente, id_persona], function(err) {
        if(err) {
          reject(err);
        } else {
          resolve({lastID: this.lastID});
        }
      });
    });
  }


// confronta la password inserita con quella salvata nel db
  static async comparePassword(candidatePassword, hash) {
    return bcrypt.compare(candidatePassword, hash);
  }


  static async creaInfo(id_utente){   
      return new Promise((resolve, reject) =>{
        db.run('INSERT INTO profilo_utente (id_utente) VALUES (?)', [id_utente], function(err){
          if(err){
            reject(err);
          } else {
            resolve({lastID: this.lastID});
          }
        });
      });
  }

  static async riempiInfo(info){
    return new Promise((resolve, reject)=>{
        db.run('UPDATE profilo_utente SET eta = ?, altezza_cm = ?, peso_kg = ?, condizioni_mediche = ? WHERE id_utente = ?', [info.eta, info.altezza_cm, info.peso_kg, info.condizioni_mediche, info.id_utente], function(err) {
        if(err){
          reject(err);
        }else{
          resolve({lastID: this.lastID});
        }
      });
    });
  }

  static async aggiornaEta(id_utente, eta){
    console.log('MODEL cerca di aggiungere:', id_utente, eta);
    return new Promise((resolve, reject)=>{
      db.run('UPDATE profilo_utente SET eta = ? WHERE id_utente = ?', [eta, id_utente], function(err){
        if(err){
          reject(err);
        }else{
          resolve({lastID: this.lastID});
        }
      });
    });
  }

  static async eliminaEta(id_utente){
    console.log('MODEL ricevuto bersaglio', id_utente);
    return new Promise((resolve, reject)=>{
      db.run('UPDATE profilo_utente SET eta = NULL WHERE id_utente = ?', [id_utente], function(err){
        if(err){
          reject(err);
        }else{
          resolve({message: 'MODEL bersaglio abbattuto'});
        }
      });
    });
  }


}

module.exports = User;