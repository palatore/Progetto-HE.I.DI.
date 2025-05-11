//File del server.js
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const db = require('./db.js');
//creazione del server Express
//importazioni dei moduli

const app = express();
const port = 3000;
//creazione dell'istanza di express e definizione della porta
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//abilitazione del CORS e del body parser per gestire le richieste JSON e URL-encoded

app.get('/', (req, res) => {
  res.send('Benvenuto nel server Express!');
});
//definizione della rotta principale

//definiziaone della rotta per l'elenco degli utenti
app.get('/utenti', (req, res) => {
  db.all('SELECT * FROM utenti', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

//definizione della rotta per l'elenco dei dietologi
app.get('/dietologi', (req, res) => {
  db.all('SELECT * FROM dietologi', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

//definizione della rotta per l'elenco degli alimenti
app.get('/alimenti', (req, res) => {
  db.all('SELECT * FROM alimenti', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

//definizione del login utenti
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.all('SELECT * FROM utenti WHERE email = ? AND password = ?', [email, password], (err, result) => {
    if(err) {
      res.status(500).json({error: err.message});
    }
    if (result.length > 0) {
      // Utente trovato, rimanda i risultati
      return res.status(200).json({ message: 'Login avvenuto' });
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
      res.status(500).json({error: err.message});
    }
    if (result.length > 0) {
      // Utente trovato, rimanda i risultati
      return res.status(200).json({ message: 'Login avvenuto' });
    } else {
      // Utente non trovato, ritorna l'errore
      return res.status(401).json({ error: 'Email e password non validi' });
    }
  });
});

//avvio del server
app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});
