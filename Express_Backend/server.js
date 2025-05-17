//File del server.js
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const db = require('./db.js');
const jwt = require('jsonwebtoken');
const CHIAVE_SEGRETA = 'kingdomhearts';
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const pastiRoutes = require('./routes/pastiRoutes');
//creazione del server Express
//importazioni dei moduli

const app = express();
const port = 3000;
//creazione dell'istanza di express e definizione della porta
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pasti', pastiRoutes);
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

//definizione registrazione
app.post('/registration', (req, res) => {
  const {ruolo, email, nome, cognome, password} = req.body;

  if(ruolo === 'dietologo') {
    db.run('INSERT INTO utenti (name, surname, email, password, ruolo) VALUES (?, ?, ?, ?, ?)', [nome, cognome, email, password, ruolo], (err) => {
      if(err) {
        return res.status(500).json(err.message);
      }
      return res.status(201).json({message: 'Registrazione avvenuta con successo'})
    });
  } else {
    db.run('INSERT INTO utenti (name, surname, email, password, ruolo) VALUES (?, ?, ?, ?, ?)', [nome, cognome, email, password, ruolo], (err) => {
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
  db.run('INSERT INTO pasti (user_id, nome, data, tipo) VALUES (?, ?, ?, ?)', [user_id, nome, data, tipo], function(err) {
    if(err) {
      return res.status(500).json(err.message);
    }
      return res.status(201).json({message: 'Pasto creato con successo', id: this.lastID});
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
