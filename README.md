PROGETTO MATERIA PROGRAMMAZIONE WEB E MOBILE
------------------------------------------------------
PROJECT FOR BACHERLOR'S DEGREE SUBJECT

HEIDI IS A WEB APP.

The acronym HE.I.DI. stands for HEalthy Interactive DIet.

FEATURES (not yet implemented)
The basic idea is to allow users to keep progress of their diet by tracking food eaten visualizing calories and properties.

Users can log in and interact with the application, program a schedule based on their need and ask for advice. The application should memorize their data and suggest a proper diet with the right amount of calories.

Users can consult a database where food is stored, they can see properties as calories, sugar, grease, proteins, vitamins held by a food sample.

Users can modify their diet whenever they want. They are able to modify a single-day schedule, a lunch-only schedule or a periodic schedule such as weekly, monthly, yearly or custom recurrence events.

User can save food in different favorites list, one for food and one for lunches.

//more ideas to be written

IMPORTANT: Dietologo-patient is a one-to-many relation. They are visibly connected and it can be seen in the user or in the dietologo profile page.

//IMPORTANTE: COSTRUIRE UNO SCHEMA E UN DIAGRAMMA E-R DA PRESENTARE AL PROFESSORE
-----------------------------------------------------
AGGIORNAMENTO 11/05/2026

Dopo aver parlato con il professore ecco i punti principali che deve avere l'applicazioe:

- UTENTE (Paziente)
    - Ha due calendari: uno dieta e uno allenamenti
    - Può creare pasti da inserire nel calendario e anche programmi di allenamento personali
    - Può richiedere valutazioni a figure professionali riguardo entrambe le cose
    - Può richiedere a figure professionali di essere seguito o di ottenere i contatti per diventare paziente
    - Le richieste possono avere un campo "Urgente" e un campo per commentare liberamente la richiesta
    - Può impostare flag quando si registra per segnalare condizioni mediche particolari presenti che influnezano dieta e/o allenamento
    - Ha una cronologia di due settimane con registrati i record di pasti e allenamenti
    - Condivide i propri pasti o allenamenti all'interno di una bacheca condivisa dal quale può copiare i pasti/allenamenti di altri utenti (timeout 24h)
    - Autenticazione a 2 fattori facoltativa (email con codice)

- Professionsta Alimentare
    - Imposta un flag con la specializzazione: dietologo, nutrizionista, diabetologo, medico, ricercatore, ecc.
    - Può personalizzare il suo profilo inserendo colleghi, ambienti di lavoro dove è situato ecc.
    - Può creare, modificare o approvare piani di alimentazione dei suoi pazienti
    - Le creazione, modifiche e le approvazioni possono avere un campo di testo per eventuali commenti e spiegazioni
    - Su richiesta (solo richieste non legate a condizioni mediche specifiche) può modificare e approvare piani di alimentazioni di utenti non pazienti
    - Può approvare richieste di "affiliazione" da parte di utenti non pazienti per iniziare a seguirli. Poi in seguito sarà sua discrezione se etichettarli come pazienti.
    - Può vedere alcuni dati dei profili utenti che gli inviano richiesta (età, peso, eventuali patologie ecc.)
    - Autenticazione a 2 fattori obbligatoria (email con codice)

- Professionista Allenamenti
    - Imposta un flag con la specializzazione: Personal Trainer, fisioterapista, insegnante di disciplina, ricercatore, ecc.
    - Può personalizzare il suo profilo inserendo colleghi, ambienti di lavoro dove è situato ecc.
    - Può creare, modificare o approvare piani di allenamento dei suoi pazienti
    - Le creazione, modifiche e le approvazioni possono avere un campo di testo per eventuali commenti e spiegazioni
    - Su richiesta (solo richieste non legate a condizioni mediche specifiche) può modificare e approvare piani di allenamenti di utenti non pazienti
    - Può approvare richieste di "affiliazione" da parte di utenti non pazienti per iniziare a seguirli. Poi in seguito sarà sua discrezione se etichettarli come pazienti.
    - Può vedere alcuni dati dei profili utenti che gli inviano richiesta (età, peso, eventuali patologie ecc.)
    - Autenticazione a 2 fattori obbligatoria (email con codice)




<idee>
1. Le figure provessionali possono venire votate dagli utenti? 1-5 stelle
2. I genitori possono registare i figli o i neonati?
3. Bacheca con pasti e allenamenti condivisi da utenti e professionisti visualizzabile universalmente per copiarli





-----------------------------------------------------

DA IMPLEMENTARE:


NOTE:
- Le funzioni di creapasto e modificapasto sono utilizzabili da utenti e dietologi(solo la seconda). Quindi ha senso che i servizi dedicati a queste funzioni rimandino alle zone di backend riservate agli utenti visto che sono loro ad effettuare l'azione.
- La home page si carica in modo diverso in base all'utente loggato, è unica e non separata per ruoli
- Cerca di seguire in modo più coerente possibile le funzioni nel diagramma senza fare giri troppo lunghi e inutilmente complessi
