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
  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT id, name, surname, email FROM utenti WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }


// confronta la password inserita con quella salvata nel db
  static async comparePassword(candidatePassword, hash) {
    return bcrypt.compare(candidatePassword, hash);
  }
}

module.exports = User;