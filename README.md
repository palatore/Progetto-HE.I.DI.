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

Suggestions from professor: include a second actor to the application called dietologo, a dietologo is a super user which can consult their patients' schedules and
interacti with them. A dietologo can rate a food, lunch or an entire day that belongs to one of their patients. Patiens can request a feedback from their dietologo. IMPORTANT: Dietologo-patient is a one-to-many relation. They are visibly connected and it can be seen in the user or in the dietologo profile page.

//IMPORTANTE: COSTRUIRE UNO SCHEMA E UN DIAGRAMMA E-R DA PRESENTARE AL PROFESSORE
-----------------------------------------------------
DA IMPLEMENTARE:

- Home page
    - Caricamento dinamico
    - Visualizzazione completa della situazione
    - Menu e rimandi veloci
    - Menu a tendina/dropdown con funzioni
- Funzione di ricerca e consultazione cibo
    - Ricerca per ogni tipo di filtro
- Funzione di creazione nuovi pasti
    - Calcolo delle calorie compreso
- Funzione di modifica pasti
- Pagina profilo utente
- Pagina profilo dietologo
- Dati utente
- Dati dietologo
- Definire permessi
- Pagina della giornata corrente per l'utente, concatenazione pasti e checklist
- Pagina della settimana corrente per l'utente
- Calendario basato su google calendar
- Backend
- CSS GLOBALE

NOTE:
- Le funzioni di creapasto e modificapasto sono utilizzabili da utenti e dietologi(solo la seconda). Quindi ha senso che i servizi dedicati a queste funzioni rimandino alle zone di backend riservate agli utenti visto che sono loro ad effettuare l'azione.
- La home page si carica in modo diverso in base all'utente loggato, è unica e non separata per ruoli
- Cerca di seguire in modo più coerente possibile le funzioni nel diagramma senza fare giri troppo lunghi e inutilmente complessi