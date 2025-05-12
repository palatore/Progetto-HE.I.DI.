//creazione del database SQLite
//creo prima il database e poi le tabelle
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Errore di connessione al database ' + err.message);
  } else {
    console.log('Connesso al database SQLite.');
  }
});
//creazione del database SQLite

db.serialize(() => {
    //creazione della tabella utenti
  db.run(`CREATE TABLE IF NOT EXISTS utenti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
  )`, (err) => {
    if (err) {
      console.error('Errore nella creazione della tabella utenti ' + err.message);
    } else {
      console.log('Tabella utenti creata con successo.');
    }
  });

  //creazione della tabella dietologi
  db.run(`CREATE TABLE IF NOT EXISTS dietologi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
  )`, (err) => {
    if (err) {
      console.error('Errore nella creazione della tabella dietologi ' + err.message);
    } else {
      console.log('Tabella dietologi creata con successo.');
    }
  });

  //creazione della tabella dei cibi
    db.run(`CREATE TABLE IF NOT EXISTS alimenti (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        categoria VARCHAR(255) NOT NULL,
        kcal decimal(6,2) NOT NULL,
        grassi_g decimal(6,2) NOT NULL,
        zuccheri_g decimal(6,2) NOT NULL,
        carboidrati_g decimal(6,2) NOT NULL,
        proteine_g decimal(6,2) NOT NULL,
        vitamine text
    )`, (err) => {
        if (err) {
            console.error('Errore nella creazione della tabella alimenti ' + err.message);
        } else {
            console.log('Tabella alimenti creata con successo.');
        }
    });

    //creazione della tabella dei pasti
    db.run(`CREATE TABLE IF NOT EXISTS pasti (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        nome VARCHAR(255) NOT NULL,
        data DATE NOT NULL,
        tipo TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES utenti(id)
    )`, (err) => {
        if (err) {
            console.error('Errore nella creazione della tabella pasti ' + err.message);
        } else {
            console.log('Tabella pasti creata con successo.');
        }
    });

    //creazione della tabella degli alimenti_pasto
    db.run(`CREATE TABLE IF NOT EXISTS alimenti_pasto (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pasto_id INTEGER NOT NULL,
        alimento_id INTEGER NOT NULL,
        quantita decimal(6,2) NOT NULL,
        FOREIGN KEY(pasto_id) REFERENCES pasti(id),
        FOREIGN KEY(alimento_id) REFERENCES alimenti(id)
    )`, (err) => {
        if (err) {
            console.error('Errore nella creazione della tabella alimenti_pasto ' + err.message);
        } else {
            console.log('Tabella alimenti_pasto creata con successo.');
        }
    });

    //popolazione della tabella utenti se non è già popolata
    db.get('SELECT COUNT(*) AS count FROM utenti', (err, row) => {
      if (err) {
        console.error('Errore nella selezione degli utenti ' + err.message);
      } else if (row.count === 0) {
        const comando = db.prepare('INSERT INTO utenti (name, surname, email, password) VALUES (?, ?, ?, ?)');
        comando.run('Pietro', 'Gambadilegno', 'pietro.gdl@steambot.dis', 'malefica');
        comando.run('Wilson Grant', 'Fisk', 'kingpin@brooklyn.com', 'marvel');
        comando.run('Taro', 'Sakamoto', 'tarosakamoto01@gmail.com', 'HanaAoi');
        comando.run('Majin', 'Buu', 'babidiofficial@regnodemoniaco.kai', 'dolcetti');
      }
    });
    //popolazione della tabella dietologi se non è già popolata
    db.get('SELECT COUNT(*) AS count FROM dietologi', (err, row) => {
        if (err) {
            console.error('Errore nella selezione dei dietologi ' + err.message);
        } else if (row.count === 0) {
            const comando = db.prepare('INSERT INTO dietologi (name, surname, email, password) VALUES (?, ?, ?, ?)');
            comando.run('Cereza', 'Balder', 'bayonetta@vigrid.fr', 'jubileus');
            comando.run('Shauna', 'Vayne', 'nighthunter@runeterra.rt', 'Demoni');
            comando.run('Dendra', 'Kihada', 'dendra.kihada@mesapoli.sp', 'Miriam');
        }
    });

    //popolazione della tabella alimenti se non è già popolata
    db.get('SELECT COUNT(*) AS count FROM alimenti', (err, row) => {
        if (err) {
            console.error('Errore nella selezione degli alimenti ' + err.message);
        } else if (row.count === 0) {
            const comando = db.prepare('INSERT INTO alimenti (name, categoria, kcal, grassi_g, zuccheri_g, carboidrati_g, proteine_g, vitamine) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
            //frutta
            comando.run('Mela', 'Frutta', 52, 0.2, 10.4, 13.8, 'Vitamina C, B1, B2, B6');
            comando.run('Banana', 'Frutta', 89, 0.3, 12.2, 22.8, 'Vitamina C, B6');
            comando.run('Arancia', 'Frutta', 47, 0.1, 9.4, 11.8, 'Vitamina C, A, B1');
            comando.run('Fragola', 'Frutta', 32, 0.3, 4.9, 7.7, 'Vitamina C, B9');
            comando.run('Uva', 'Frutta', 69.0, 0.2, 15.0, 18.0, 'Vitamina C, K');
            comando.run('Avocado', 'Frutta', 160.0, 15.0, 0.7, 9.0, 'Vitamine C, E, K, B5');
            comando.run('Pera', 'Frutta', 57.0, 0.1, 10.4, 15.2, 'Vitamina C, K');
            comando.run('Kiwi', 'Frutta', 61.0, 0.5, 8.9, 14.7, 'Vitamina C, K, E');
            comando.run('Ciliegia', 'Frutta', 63.0, 0.2, 12.8, 16.0, 'Vitamina C, A');
            comando.run('Melone', 'Frutta', 34.0, 0.2, 8.0, 8.0, 'Vitamina A, C');
            comando.run('Pesca', 'Frutta', 39.0, 0.3, 8.4, 9.5, 'Vitamina C, A');
            comando.run('Ananas', 'Frutta', 50.0, 0.1, 9.9, 13.1, 'Vitamina C, B6');
            comando.run('Mango', 'Frutta', 60.0, 0.4, 14.0, 15.0, 'Vitamina C, A');
            comando.run('Cocco', 'Frutta', 354.0, 33.0, 6.2, 15.2, 'Vitamina C, E');
            comando.run('Limone', 'Frutta', 29.0, 0.3, 2.5, 9.3, 'Vitamina C, B6');
            comando.run('Melograno', 'Frutta', 83.0, 1.2, 13.7, 18.7, 'Vitamina C, K');

            //verdura
            comando.run('Carota', 'Verdura', 41, 0.2, 4.7, 9.6, 'Vitamina A, K, B6');
            comando.run('Broccoli', 'Verdura', 55, 0.6, 1.7, 11.2, 'Vitamina C, K, A, B9, Folato');
            comando.run('Spinaci', 'Verdura', 23, 0.4, 0.4, 3.6, 'Vitamina A, C, K, B9, Ferro');
            comando.run('Pomodoro', 'Verdura', 18, 0.2, 2.6, 3.9, 'Vitamina C, K, A, B9');
            comando.run('Peperone', 'Verdura', 20, 0.2, 4.2, 4.7, 'Vitamina C, A, B6');
            comando.run('Cavolfiore', 'Verdura', 25, 0.3, 1.9, 4.9, 'Vitamina C, K, B6');
            comando.run('Zucchina', 'Verdura', 17, 0.3, 1.7, 3.1, 'Vitamina C, A, B6');
            comando.run('Cetriolo', 'Verdura', 16, 0.1, 1.5, 3.6, 'Vitamina K, C');
            comando.run('Melanzana', 'Verdura', 25, 0.2, 3.2, 5.9, 'Vitamina B1, B6');
            comando.run('Cavolo', 'Verdura', 25, 0.1, 1.5, 4.7, 'Vitamina C, K');
            comando.run('Ravanello', 'Verdura', 16, 0.1, 3.4, 3.4, 'Vitamina C, B6');
            comando.run('Asparago', 'Verdura', 20, 0.2, 1.9, 3.7, 'Vitamina K, A, C');
            comando.run('Fagiolini', 'Verdura', 31, 0.2, 1.4, 7.1, 'Vitamina C, K, A');

            //carne
            comando.run('Pollo', 'Carne', 239, 14.0, 0.0, 0.0, 'Vitamina B6, B3, B12, Selenio');
            comando.run('Manzo', 'Carne', 250, 20.0, 0.0, 0.0, 'Vitamina B12, B6, Ferro');
            comando.run('Maiale', 'Carne', 242, 16.0, 0.0, 0.0, 'Vitamina B1, B6, B12');
            comando.run('Tacchino', 'Carne', 135, 1.0, 0.0, 0.0, 'Vitamina B6, B3, B12');
            comando.run('Agnello', 'Carne', 294, 21.0, 0.0, 0.0, 'Vitamina B12, B6, Ferro');
            comando.run('Fegato', 'Carne', 175, 5.0, 0.0, 0.0, 'Vitamina A, B12, Ferro');
            comando.run('Salsiccia', 'Carne', 301, 26.0, 0.0, 0.0, 'Vitamina B1, B6, B12');
            comando.run('Prosciutto', 'Carne', 145, 4.0, 0.0, 0.0, 'Vitamina B1, B6, B12');
            comando.run('Bacon', 'Carne', 541, 42.0, 0.0, 0.0, 'Vitamina B1, B6, B12');
            comando.run('Polpette', 'Carne', 250, 15.0, 0.0, 0.0, 'Vitamina B6, B12, Ferro');
            comando.run('Coniglio', 'Carne', 173, 8.0, 0.0, 0.0, 'Vitamina B12, B6, Ferro');
            comando.run('Anatra', 'Carne', 337, 28.0, 0.0, 0.0, 'Vitamina B12, B6, Ferro');
            comando.run('Cinghiale', 'Carne', 143, 4.0, 0.0, 0.0, 'Vitamina B1, B6, B12');
            comando.run('Petto di pollo', 'Carne', 165, 3.6, 0.0, 0.0, 'Vitamina B6, B3, B12');
            comando.run('Pollo arrosto', 'Carne', 239, 14.0, 0.0, 0.0, 'Vitamina B6, B3, B12');
            comando.run('Carne macinata', 'Carne', 250, 20.0, 0.0, 0.0, 'Vitamina B12, B6, Ferro');

            //pesce
            comando.run('Salmone', 'Pesce', 206, 13.0, 0.0, 0.0, 'Vitamina D, B12, Omega-3');
            comando.run('Tonno', 'Pesce', 132, 1.0, 0.0, 0.0, 'Vitamina D, B12, Omega-3');
            comando.run('Merluzzo', 'Pesce', 105, 0.9, 0.0, 0.0, 'Vitamina B12, Selenio');
            comando.run('Sgombro', 'Pesce', 205, 13.0, 0.0, 0.0, 'Vitamina D, B12, Omega-3');
            comando.run('Sardina', 'Pesce', 208, 11.0, 0.0, 0.0, 'Vitamina D, B12, Omega-3');
            comando.run('Trota', 'Pesce', 148, 6.0, 0.0, 0.0, 'Vitamina D, B12, Omega-3');
            comando.run('Pesce spada', 'Pesce', 140, 5.0, 0.0, 0.0, 'Vitamina D, B12, Omega-3');
            comando.run('Gambero', 'Pesce', 99, 1.0, 0.0, 0.0, 'Vitamina B12, Selenio');
            comando.run('Calamaro', 'Pesce', 92, 1.0, 0.0, 0.0, 'Vitamina B12, Selenio');
            comando.run('Polpo', 'Pesce', 82, 1.0, 0.0, 0.0, 'Vitamina B12, Selenio');
            comando.run('Aragosta', 'Pesce', 89, 1.0, 0.0, 0.0, 'Vitamina B12, Selenio');
            comando.run('Cozza', 'Pesce', 172, 2.0, 0.0, 0.0, 'Vitamina B12, Selenio');
            comando.run('Scampi', 'Pesce', 97, 1.0, 0.0, 0.0, 'Vitamina B12, Selenio');
            comando.run('Acciuga', 'Pesce', 210, 13.0, 0.0, 0.0, 'Vitamina D, B12, Omega-3');
            comando.run('Sgombro affumicato', 'Pesce', 250, 20.0, 0.0, 0.0, 'Vitamina D, B12, Omega-3');
            comando.run('Baccalà', 'Pesce', 105, 0.9, 0.0, 0.0, 'Vitamina B12, Selenio');
            comando.run('Sgombro alla griglia', 'Pesce', 205, 13.0, 0.0, 0.0, 'Vitamina D, B12, Omega-3');

            //cereali
            comando.run('Riso', 'Cereali', 130, 0.3, 0.1, 28.0, 'Vitamina B1, B3');
            comando.run('Pasta', 'Cereali', 131, 1.1, 0.6, 25.0, 'Vitamina B1, B3');
            comando.run('Pane', 'Cereali', 265, 3.2, 0.5, 49.0, 'Vitamina B1, B3');
            comando.run('Farina', 'Cereali', 364, 1.0, 0.2, 76.0, 'Vitamina B1, B3');
            comando.run('Avena', 'Cereali', 389, 6.9, 0.5, 66.3, 'Vitamina B1, B3');
            comando.run('Mais', 'Cereali', 365, 4.7, 0.9, 74.3, 'Vitamina B1, B3');
            comando.run('Orzo', 'Cereali', 354, 1.2, 0.4, 73.5, 'Vitamina B1, B3');
            comando.run('Segale', 'Cereali', 338, 1.5, 0.4, 74.0, 'Vitamina B1, B3');
            comando.run('Quinoa', 'Cereali', 120, 1.9, 0.9, 21.3, 'Vitamina B1, B3');
            comando.run('Grano saraceno', 'Cereali', 343, 3.4, 0.8, 71.5, 'Vitamina B1, B3');

            //latticini
            comando.run('Latte', 'Latticini', 42, 1.0, 5.0, 4.8, 'Vitamina B2, B12, Calcio');
            comando.run('Yogurt', 'Latticini', 59, 3.3, 4.7, 4.7, 'Vitamina B2, B12, Calcio');
            comando.run('Formaggio', 'Latticini', 402, 33.0, 0.0, 1.3, 'Vitamina B2, B12, Calcio');
            comando.run('Burro', 'Latticini', 717, 81.0, 0.1, 0.1, 'Vitamina A, D, E');
            comando.run('Panna', 'Latticini', 340, 36.0, 3.0, 2.9, 'Vitamina A, D, E');
            comando.run('Ricotta', 'Latticini', 174, 13.0, 0.0, 3.0, 'Vitamina B2, B12, Calcio');
            comando.run('Mozzarella', 'Latticini', 280, 17.0, 0.0, 3.0, 'Vitamina B2, B12, Calcio');
            comando.run('Cagliata', 'Latticini', 98, 4.0, 0.0, 3.0, 'Vitamina B2, B12, Calcio');
            comando.run('Ricotta di pecora', 'Latticini', 174, 13.0, 0.0, 3.0, 'Vitamina B2, B12, Calcio');
            comando.run('Latte condensato', 'Latticini', 321, 7.9, 54.0, 8.0, 'Vitamina B2, B12, Calcio');

            //snack
            comando.run('Patatine', 'Snack', 536, 34.0, 0.0, 53.0, 'Vitamina B1, B3');
            comando.run('Popcorn', 'Snack', 387, 4.5, 0.9, 78.0, 'Vitamina B1, B3');
            comando.run('Biscotti', 'Snack', 502, 20.0, 0.5, 70.0, 'Vitamina B1, B3');
            comando.run('Cioccolato', 'Snack', 546, 31.0, 0.0, 61.0, 'Vitamina B1, B3');
            comando.run('Caramelle', 'Snack', 392, 0.1, 98.0, 0.0, 'Vitamina B1, B3');
            comando.run('Barrette energetiche', 'Snack', 400, 15.0, 30.0, 45.0, 'Vitamina B1, B3');
            comando.run('Snack di riso', 'Snack', 387, 4.5, 0.9, 78.0, 'Vitamina B1, B3');
            comando.run('Cracker', 'Snack', 502, 20.0, 0.5, 70.0, 'Vitamina B1, B3');
            comando.run('Tortilla chips', 'Snack', 536, 34.0, 0.0, 53.0, 'Vitamina B1, B3');
            comando.run('Barrette di cereali', 'Snack', 400, 15.0, 30.0, 45.0, 'Vitamina B1, B3');

            //bevande
            comando.run('Acqua', 'Bevande', 0, 0.0, 0.0, 0.0, 'Nessuna');
            comando.run('Caffè', 'Bevande', 2, 0.0, 0.0, 0.0, 'Nessuna');
            comando.run('Tè', 'Bevande', 1, 0.0, 0.0, 0.0, 'Nessuna');
            comando.run('Succo d\'arancia', 'Bevande', 45, 0.1, 9.4, 11.8, 'Vitamina C, A, B1');
            comando.run('Succo di mela', 'Bevande', 46, 0.1, 10.4, 12.8, 'Vitamina C, B1');
            comando.run('Succo di pomodoro', 'Bevande', 17, 0.2, 3.9, 4.7, 'Vitamina C, A, K');
            comando.run('Succo di limone', 'Bevande', 22, 0.3, 6.9, 7.4, 'Vitamina C, B1');
            comando.run('Succo di ananas', 'Bevande', 50, 0.1, 9.9, 13.1, 'Vitamina C, B6');
            comando.run('Succo di pompelmo', 'Bevande', 38, 0.1, 8.1, 10.4, 'Vitamina C, A');
            comando.run('Succo di carota', 'Bevande', 41, 0.2, 4.7, 9.6, 'Vitamina A, K, B6');
            comando.run('Succo di mirtillo', 'Bevande', 57, 0.1, 14.0, 18.0, 'Vitamina C, K');
            comando.run('Succo di uva', 'Bevande', 69, 0.2, 15.0, 18.0, 'Vitamina C, K');
            comando.run('Succo di pompelmo rosa', 'Bevande', 38, 0.1, 8.1, 10.4, 'Vitamina C, A');
            comando.run('Succo di melograno', 'Bevande', 83, 1.2, 13.7, 18.7, 'Vitamina C, K');
            comando.run('Succo di pesca', 'Bevande', 39, 0.3, 8.4, 9.5, 'Vitamina C, A');
            comando.run('Succo di fragola', 'Bevande', 32, 0.3, 4.9, 7.7, 'Vitamina C, B9');
            comando.run('Succo di melone', 'Bevande', 34, 0.2, 8.0, 8.0, 'Vitamina A, C');
            comando.run('Succo di kiwi', 'Bevande', 61, 0.5, 8.9, 14.7, 'Vitamina C, K, E');

            //dolci
            comando.run('Torta al cioccolato', 'Dolci', 350, 15.0, 40.0, 45.0, 'Vitamina B1, B3');
            comando.run('Torta di mele', 'Dolci', 250, 10.0, 30.0, 35.0, 'Vitamina C, B1');
            comando.run('Torta di carote', 'Dolci', 300, 12.0, 35.0, 40.0, 'Vitamina A, K, B6');
            comando.run('Torta di fragole', 'Dolci', 280, 8.0, 25.0, 30.0, 'Vitamina C, B9');
            comando.run('Torta di limone', 'Dolci', 320, 10.0, 30.0, 35.0, 'Vitamina C, B1');
            comando.run('Torta di noci', 'Dolci', 400, 20.0, 25.0, 30.0, 'Vitamina B1, B3');
            comando.run('Torta di cioccolato bianco', 'Dolci', 450, 25.0, 30.0, 35.0, 'Vitamina B1, B3');

            //bevande alcoliche
            comando.run('Birra', 'Bevande alcoliche', 43, 0.0, 0.0, 3.6, 'Vitamina B1, B3');
            comando.run('Vino rosso', 'Bevande alcoliche', 85, 0.0, 0.0, 2.6, 'Vitamina B1, B3');
            comando.run('Vino bianco', 'Bevande alcoliche', 83, 0.0, 0.0, 2.5, 'Vitamina B1, B3');
            comando.run('Champagne', 'Bevande alcoliche', 91, 0.0, 0.0, 3.2, 'Vitamina B1, B3');
            comando.run('Whisky', 'Bevande alcoliche', 250, 0.0, 0.0, 0.0, 'Vitamina B1, B3');
            comando.run('Vodka', 'Bevande alcoliche', 231, 0.0, 0.0, 0.0, 'Vitamina B1, B3');
            comando.run('Rum', 'Bevande alcoliche', 230, 0.0, 0.0, 0.0, 'Vitamina B1, B3');
            comando.run('Tequila', 'Bevande alcoliche', 231, 0.0, 0.0, 0.0, 'Vitamina B1, B3');
            comando.run('Gin', 'Bevande alcoliche', 263, 0.0, 0.0, 0.0, 'Vitamina B1, B3');

            //bevande gassate
            comando.run('Coca-Cola', 'Bevande gassate', 42, 0.0, 10.6, 10.6, 'Nessuna');
            comando.run('Pepsi', 'Bevande gassate', 41, 0.0, 10.4, 10.4, 'Nessuna');
            comando.run('Fanta', 'Bevande gassate', 46, 0.0, 11.0, 11.0, 'Nessuna');
            comando.run('Sprite', 'Bevande gassate', 38, 0.0, 9.3, 9.3, 'Nessuna');
            comando.run('7UP', 'Bevande gassate', 38, 0.0, 9.3, 9.3, 'Nessuna');
            comando.run('Dr Pepper', 'Bevande gassate', 41, 0.0, 10.4, 10.4, 'Nessuna');
            comando.run('Mountain Dew', 'Bevande gassate', 54, 0.0, 14.0, 14.0, 'Nessuna');

            //merendine
            comando.run('Merendina al cioccolato', 'Merendine', 450, 20.0, 40.0, 45.0, 'Vitamina B1, B3');
            comando.run('Merendina alla vaniglia', 'Merendine', 400, 15.0, 35.0, 40.0, 'Vitamina B1, B3');
            comando.run('Merendina alla fragola', 'Merendine', 380, 12.0, 30.0, 35.0, 'Vitamina C, B9');
            comando.run('Merendina al limone', 'Merendine', 370, 10.0, 25.0, 30.0, 'Vitamina C, B1');
            comando.run('Merendina al cocco', 'Merendine', 500, 25.0, 50.0, 55.0, 'Vitamina B1, B3');

            //gelato
            comando.run('Gelato alla vaniglia', 'Gelato', 207, 11.0, 22.0, 23.0, 'Vitamina A, D');
            comando.run('Gelato al cioccolato', 'Gelato', 216, 12.0, 23.0, 24.0, 'Vitamina A, D');
            comando.run('Gelato alla fragola', 'Gelato', 210, 11.0, 22.0, 23.0, 'Vitamina C, B9');
            comando.run('Gelato al limone', 'Gelato', 200, 10.0, 20.0, 21.0, 'Vitamina C, B1');
            comando.run('Gelato al cocco', 'Gelato', 250, 15.0, 30.0, 35.0, 'Vitamina A, D');
            comando.run('Gelato al pistacchio', 'Gelato', 220, 12.0, 23.0, 24.0, 'Vitamina A, D');
            comando.run('Gelato al caffè', 'Gelato', 210, 11.0, 22.0, 23.0, 'Vitamina B2, B3');

            //pizza
            comando.run('Pizza Margherita', 'Pizza', 285, 10.0, 2.0, 36.0, 'Vitamina B1, B3');
            comando.run('Pizza Prosciutto e Funghi', 'Pizza', 300, 12.0, 3.0, 38.0, 'Vitamina B1, B3');
            comando.run('Pizza Quattro Stagioni', 'Pizza', 320, 14.0, 4.0, 40.0, 'Vitamina B1, B3');
            comando.run('Pizza Capricciosa', 'Pizza', 330, 15.0, 5.0, 42.0, 'Vitamina B1, B3');

            //fast food
            comando.run('Hamburger', 'Fast food', 250, 12.0, 0.0, 0.0, 'Vitamina B1, B3');
            comando.run('Cheeseburger', 'Fast food', 300, 15.0, 0.0, 0.0, 'Vitamina B1, B3');
            comando.run('Hot dog', 'Fast food', 150, 10.0, 0.0, 0.0, 'Vitamina B1, B3');
            comando.run('Patatine fritte', 'Fast food', 365, 17.0, 0.0, 0.0, 'Vitamina B1, B3');
            comando.run('Chicken nuggets', 'Fast food', 290, 15.0, 0.0, 0.0, 'Vitamina B1, B3');
            comando.run('Fish and chips', 'Fast food', 350, 20.0, 0.0, 0.0, 'Vitamina B1, B3');
            comando.run('Pizza al taglio', 'Fast food', 300, 12.0, 3.0, 38.0, 'Vitamina B1, B3');
            comando.run('Kebab', 'Fast food', 400, 20.0, 0.0, 0.0, 'Vitamina B1, B3');
            comando.run('Tacos', 'Fast food', 200, 10.0, 0.0, 0.0, 'Vitamina B1, B3');
            comando.run('Nachos', 'Fast food', 400, 20.0, 0.0, 0.0, 'Vitamina B1, B3');
            comando.run('Frittura mista', 'Fast food', 350, 25.0, 0.0, 0.0, 'Vitamina B1, B3');
        }
    });

});

module.exports = db;
//esporto il database per poterlo utilizzare in altri file