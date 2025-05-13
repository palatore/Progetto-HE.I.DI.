//File del server.js
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const db = require('./db.js');
const jwt = require('jsonwebtoken');
const CHIAVE_SEGRETA = 'kingdomhearts';
//creazione del server Express
//importazioni dei moduli

const app = express();
const port = 3000;
//creazione dell'istanza di express e definizione della porta
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//abilitazione del CORS e del body parser per gestire le richieste JSON e URL-encoded

//funzione per importare il token e passare l'id utente al backend
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token mancante' });

  jwt.verify(token, CHIAVE_SEGRETA, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token non valido' });
    req.user = user;
    next();
  });
}

app.get('/', (req, res) => {
  res.send('Benvenuto nel server Express!');
});
//definizione della rotta principale

//definiziaone della rotta per l'elenco degli utenti
app.get('/utenti', (req, res) => {
  db.all('SELECT * FROM utenti', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } else {
      return res.json(rows);
    }
  });
});

//definizione della rotta per l'elenco dei dietologi
app.get('/dietologi', (req, res) => {
  db.all('SELECT * FROM dietologi', [], (err, rows) => {
    if (err) {
     return  res.status(500).json({ error: err.message });
    } else {
      return res.json(rows);
    }
  });
});

//definizione della rotta per l'elenco degli alimenti
app.get('/alimenti', (req, res) => {
  db.all('SELECT * FROM alimenti', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } else {
      return res.json(rows);
    }
  });
});

//definizione della rotta per l'elenco dei pasti
app.get('/pasti', (req, res) => {
  db.all('SELECT * FROM pasti', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } else {
      return res.json(rows);
    }
  });
});

//definizione della rotta per i dettagli dei pasti
app.get('/alimenti_pasti', (req, res) => {
  db.all('SELECT * FROM alimenti_pasti', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } else {
      return res.json(rows);
    }
  });
});

//definizione delle rotta per ricerche pasti
app.post('/checkPasto', authenticateToken, (req, res) =>{
  const user_id = req.user.id;
  const {nome, data, tipo} = req.body;
  db.all('SELECT * FROM pasti WHERE user_id = ? AND nome = ?  AND data = ? AND tipo = ?', [user_id, nome, data, tipo], (err, result) => {
    if(err) {
      return res.status(500).json(err.message);
    } else if(result.length > 0){
      res.status(200).json({exists: true});
    } else {
      res.status(200).json({exists: false});
    }
  });
});

//definizione del login utenti
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.all('SELECT * FROM utenti WHERE email = ? AND password = ?', [email, password], (err, result) => {
    if(err) {
      return res.status(500).json({error: err.message});
    }
    if (result.length > 0) {
      // Utente trovato, rimanda i risultati e gen era il token
      const user = result[0];
      const token = jwt.sign(
        { id: user.id, email: user.email, ruolo: 'utente'},
        CHIAVE_SEGRETA,
        {expiresIn:'2h'}
      );
      return res.status(201).json({ message: 'Login avvenuto', token });
    } else {
      // Utente non trovato, ritorna l'errore
      return res.status(401).json({ error: 'Email e password non validi' });
    }
  });
});

//definizione del login dietologi
app.post('/loginD', (req, res) => {
  const { email, password } = req.body;

  db.all('SELECT * FROM dietologi WHERE email = ? AND password = ?', [email, password], (err, result) => {
    if(err) {
      return res.status(500).json({error: err.message});
    }
    if (result.length > 0) {
      // Utente trovato, rimanda i risultati
      const user = result[0];
      const token = jwt.sign(
        { id: user.id, email: user.email, ruolo: 'dietologo'},
        CHIAVE_SEGRETA,
        {expiresIn:'2h'}
      );
      return res.status(201).json({ message: 'Login avvenuto', token });
    } else {
      // Utente non trovato, ritorna l'errore
      return res.status(401).json({ error: 'Email e password non validi' });
    }
  });
});

//definizione registrazione
app.post('/registration', (req, res) => {
  const {ruolo, email, nome, cognome, password} = req.body;

  if(ruolo === 'dietologo') {
    db.run('INSERT INTO dietologi (name, surname, email, password) VALUES (?, ?, ?, ?)', [nome, cognome, email, password], (err) => {
      if(err) {
        return res.status(500).json(err.message);
      }
      return res.status(201).json({message: 'Registrazione avvenuta con successo'})
    });
  } else {
    db.run('INSERT INTO utenti (name, surname, email, password) VALUES (?, ?, ?, ?)', [nome, cognome, email, password], (err) => {
      if(err) {
        return res.status(500).json(err.message);
      }
      return res.status(201).json({message: 'Registrazione avvenuta con successo'})
    });
  }
});

//definizione post creazione pasti
app.post('/creaPasti', authenticateToken, (req, res) => {
  const user_id = req.user.id;
  const {nome, data, tipo} = req.body;
  db.run('INSERT INTO pasti (user_id, nome, data, tipo) VALUES (?, ?, ?, ?)', [user_id, nome, data, tipo], (err) => {
    if(err) {
      return res.status(500).json(err.message);
    } else {
      return res.status(201).json({message: 'Pasto creato con successo'});
    }
  });
});

//definizione post creazione dettaglio pasti
app.post('/riempiPasti', (req, res) => {
  const {pasto_id, alimento_id, quantita} = req.body;
  db.run('INSERT INTO alimenti_pasto (pasto_id, alimento_id, quantita) VALUES (?, ?, ?)' [pasto_id, alimento_id, quantita], (err) => {
    if(err) {
      return res.status(500).json(err.message);
    } else {
      return res.status(201).json({message: 'Alimenti inseriti con successo'});
    }
  });
});

//avvio del server
app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});
