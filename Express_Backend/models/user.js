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
      db.get('SELECT id, name, surname, email, password, ruolo FROM utenti WHERE id = ?', [id_utente], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static async findInfo(id_utente){
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

  static async getRichieste() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM richieste', (err, rows) => {
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
      db.all('SELECT u.id, u.name, u.surname, u.email, u.ruolo, r.ruolo AS professione FROM utenti u INNER JOIN albo_professionisti a ON u.id = a.id_professionista INNER JOIN ruoli_professionisti r ON a.id_ruolo = r.id WHERE u.ruolo > 0', (err, rows) => {
        if(err){
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getRuoliProfessionisti() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM ruoli_professionisti', (err, rows) => {
          if (err) {
            reject(err);
          } else {
          resolve(rows);
          }
        }
      );
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
      db.all('SELECT a.id AS id_associazione, a.id_professionista, u.name AS nome_P, u.surname AS cognome_P, u.ruolo, a.stato FROM associazioni a JOIN utenti u ON a.id_professionista = u.id WHERE a.id_paziente = ?', [id_utente], (err, rows) => {
        if(err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getAssociazioniProfessionista(id_professionista) {
    return new Promise((resolve, reject) => {
      db.all('SELECT a.id AS id_associazione, a.id_paziente, u.name AS nome_p, u.surname AS cognome_p, a.stato FROM associazioni a JOIN utenti u ON a.id_paziente = u.id WHERE a.id_professionista = ?', [id_professionista], (err, rows) => {
        if(err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getRichiesteUtente(id_utente) {
    return new Promise((resolve, reject) => {
      db.all('SELECT r.id, r.id_attivita, r.tipologia_attivita, r.tipo_richiesta, r.stato, u.name AS nome_P, u.surname AS cognome_P FROM richieste r JOIN utenti u ON r.id_professionista = u.id WHERE r.id_paziente = ?', [id_utente], (err, rows) => {
        if(err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getRichiesteProfessionista(id_professionista) {
    return new Promise((resolve, reject) => {
      db.all('SELECT r.id, r.id_attivita, r.tipologia_attivita, r.tipo_richiesta, r.stato, u.name AS nome_p, u.surname AS cognome_p FROM richieste r JOIN utenti u ON r.id_paziente = u.id WHERE r.id_professionista = ?', [id_professionista], (err, rows) => {
        if(err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getAssociazioniPending(id_professionista) {
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

  static async getRichiestePending(id_professionista) {
    return new Promise((resolve, reject) => {
      db.all('SELECT r.id, r.stato FROM richieste r WHERE r.id_professionista = ? AND r.stato = "PENDING"', [id_professionista], (err, rows) => {
        if(err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getFeedAssociati(id_professionsita) {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT 'PASTO' AS tipologia, p.name AS nome_attivita, p.data_creazione, u.name, u.surname
        FROM pasti p
        INNER JOIN associazioni a ON p.user_id = a.id_paziente
        INNER JOIN utenti u ON p.user_id = u.id
        WHERE a.id_professionista = ? AND a.stato = 'ACCETTATA'

        UNION ALL

        SELECT 'ALLENAMENTO' AS tipologia, al.name AS nome_attivita, al.data_creazione, u.name, u.surname
        FROM allenamenti al
        INNER JOIN associazioni a ON al.user_id = a.id_paziente
        INNER JOIN utenti u ON al.user_id = u.id
        WHERE a.id_professionista = ? AND a.stato = 'ACCETTATA'

        ORDER BY data_creazione DESC
        LIMIT 10;`, [id_professionsita, id_professionsita], (err, rows) => {
        if(err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async iscriviProfessionista(id_professionista, id_ruolo) {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO albo_professionisti (id_professionista, id_ruolo) VALUES (?, ?)', [id_professionista, id_ruolo], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
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

  static async accettaAssociazione(id_associazione) {
    return new Promise((resolve, reject) => {
      db.run('UPDATE associazioni SET stato = "ACCETTATA" WHERE id = ?', [id_associazione], function(err) {
        if(err) {
          reject(err);
        } else {
          resolve({lastID: this.lastID});
        }
      });
    });
  }

  static async creaRichiesta(id_utente, dati) {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO richieste (id_professionista, id_paziente, id_attivita, tipologia_attivita, tipo_richiesta) VALUES (?, ?, ?, ?, ?)', [dati.id_professionista, id_utente, dati.id_attivita, dati.tipologia_attivita, dati.tipo_richiesta], function(err) {
        if(err) {
          reject(err);
        } else {
          resolve({lastID: this.lastID});
        }
      });
    });
  }

  static async accettaRichiesta(id_richiesta, tipo_richiesta) {
    return new Promise((resolve, reject) => {
      db.run('UPDATE richieste SET stato = ? WHERE id = ?', [tipo_richiesta, id_richiesta], function(err) {
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

  static async riempiInfo(info) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id FROM profilo_utente WHERE id_utente = ?',
      [info.id_utente],
      (err, row) => {
        if (err) return reject(err);

        if (row) {
          db.run(
            `UPDATE profilo_utente
             SET eta = ?, altezza_cm = ?, peso_kg = ?, condizioni_mediche = ?
             WHERE id_utente = ?`,
            [
              info.eta,
              info.altezza_cm,
              info.peso_kg,
              info.condizioni_mediche,
              info.id_utente
            ],
            function (err) {
              if (err) return reject(err);
              resolve({ success: true, action: 'update' });
            }
          );
        } else {
          db.run(
            `INSERT INTO profilo_utente
             (id_utente, eta, altezza_cm, peso_kg, condizioni_mediche)
             VALUES (?, ?, ?, ?, ?)`,
            [
              info.id_utente,
              info.eta,
              info.altezza_cm,
              info.peso_kg,
              info.condizioni_mediche
            ],
            function (err) {
              if (err) return reject(err);
              resolve({ success: true, action: 'insert' });
            }
          );
        }
      }
    );
  });
}

  static async aggiornaEta(id_utente, eta){
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

  static async aggiornaPasswordHash(id_utente, nuovaPassword){
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nuovaPassword, salt);
    return new Promise(async (resolve, reject)=>{
      db.run('UPDATE utenti SET password = ? WHERE id = ?', [hashedPassword, id_utente], function(err){
        if(err){
          reject(err);
        }else{
          resolve({lastID: this.lastID});
        }
      });
    });
  }

  static async annullaAssociazione(id_associazione) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM associazioni WHERE id = ?', [id_associazione], function(err) {
        if(err) {
          reject(err);
        } else {
          resolve({lastID: this.lastID});
        }
      });
    });
  }

  static async annullaRichiesta(id_richiesta) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM richieste WHERE id = ?', [id_richiesta], function(err) {
        if(err) {
          reject(err);
        } else {
          resolve({lastID: this.lastID});
        }
      });
    });
  }
}
module.exports = User;