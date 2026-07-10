<sub>Alberto Scannaliato 0764190</sub>
<sub>Paolosalvatore Piazza 0681850</sub>
![[mountain_line_art.png]]
**HEIDI** (HEalthy Interactive DIet) è un'idea per un'applicazione web distribuita per desktop e dispositivi mobile nell'ambito della salute e dell'alimentazione.

## **Obiettivo del progetto**
L'idea è quella di permettere a un utente registrato di gestire un proprio stile di vita salutare tra alimentazione ed esercizio fisico con l'aiuto di più funzionalità e con l'intervento di una o più figure professionali all'interno dell'applicazione (profilo professionista alimentare/allenamenti).

___
___
## **Funzionalità Front-end**

<center><h1> Pagine </h1></center>

## Login Page

> [!abstract] Descrizione
> Questa pagina permette l'accesso completo alle funzionalità dell'applicazione, 
> tramite l'inserimento di email e password definiti in fase di registrazione.

### Metodi lifecycle della pagina

#### `ngOnInit()`

**Scopo:** verifica, all'inizializzazione del componente, se l'utente ha già 
una sessione attiva.

**Funzionamento:**
Controlla la presenza di `tipoUtente`, `userEmail` e `token` nel `localStorage`. 
Se tutti e tre i valori sono presenti, la logica di reindirizzamento automatico 
alla Home Page è predisposta ma attualmente disattivata (commentata), in quanto 
tale responsabilità è demandata a un guard di routing.

---

### Metodi implementati
#### `onSubmit()`

**Firma:** `onSubmit(): Promise<void>`

**Scopo:** gestisce l'invio del form di login, dalla validazione dei dati fino 
al reindirizzamento dell'utente nella pagina corretta.

**Funzionamento:**
1. Verifica la validità del `loginForm` tramite un guard clause: se il form 
   non è valido, interrompe subito l'esecuzione
2. Resetta i flag `loginFailed` e `showError`, per garantire uno stato pulito 
   ad ogni nuovo tentativo di login
3. All'interno di un blocco `try/catch`, chiama il `LoginService` per 
   effettuare una richiesta HTTP POST al backend, attendendone la risposta 
   tramite `await firstValueFrom`
4. Dalla risposta ottenuta, decodifica il token ricevuto, tramite la libreria 
   `jwt-decode`, per estrarre il ruolo dell'utente nella variabile 'ruolo'
5. Salva `userEmail` e `token` nel `localStorage`, per mantenere la sessione 
   attiva anche dopo il refresh della pagina
6. Chiama nuovamente il `LoginService` , chiamando `onLoginSuccess(ruolo)`, 
   per reindirizzare l'utente nella Home Page corrispondente al proprio ruolo


>[!example] **Parametri:**
Lavora col form del login, il quale presenta questa struttura: 
`loginForm = this.formBuilder.group({`
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]


> [!note] Gestione degli errori
> Il blocco `catch` gestisce due casistiche:
> - **Errore 401** (credenziali non valide): imposta i flag `loginFailed` e 
>   `showError`, recuperando il messaggio d'errore restituito dal backend 
>   (`e?.error?.message`)
> - **Qualsiasi altro errore** (es. rete non disponibile, errore del server): 
>   imposta gli stessi flag, mostrando il messaggio del backend se disponibile, 
>   oppure un messaggio di default ("Dati di accesso non validi")

---
---

## Registrazione Page

> [!abstract] Descrizione
> Questa pagina permette la creazione di un nuovo account, tramite l'inserimento 
> di ruolo, nome, cognome, email e password. Per i ruoli di tipo professionista, 
> richiede inoltre la selezione di una specializzazione tra quelle disponibili. 
> Include una validazione personalizzata per garantire la corrispondenza tra 
> password e conferma password.

### Metodi implementati

#### `passwordMatchValidator()`

**Firma:** `passwordMatchValidator(): ValidatorFn`

**Scopo:** validatore personalizzato a livello di `FormGroup`, utilizzato per 
verificare che i campi `password` e `repeatpw` coincidano.

**Funzionamento:**
Confronta i valori dei due campi: se coincidono restituisce `null` (nessun 
errore), altrimenti restituisce un oggetto di errore `{ passwordMismatch: true }`, 
che invalida l'intero `FormGroup`. Il validatore viene applicato in fase di 
creazione del form ed è ricontrollato ogni volta che uno dei due campi cambia 
valore, grazie alle sottoscrizioni a `valueChanges` impostate nel costruttore.


>[!example] Parametri:
la funzione NON accetta parametri in ingresso, ma lavora con i dati presenti nel seguente form:
>
`registerForm = formbuilder.group({
`
      `ruolo: ['', Validators.required],`
>
  `   id_ruolo_professionista: [''],`
>
     ` email: ['', [Validators.required, Validators.email]],`
>
      `nome: ['', Validators.required],`
>
      `cognome:['', Validators.required],`
>
     `password:['', [Validators.required, Validators.minLength(8)]],`
>
     ` repeatpw:['', [Validators.required, Validators.minLength(8)]]`
``

---

#### `loadRuoliProfessionista()`

**Firma:** `loadRuoliProfessionista(): Promise<void>`

**Scopo:** recupera l'elenco delle specializzazioni professionali disponibili, 
da mostrare in un `ion-select` quando l'utente si registra come professionista.

**Funzionamento:**
Chiama il `LoginService` per effettuare la richiesta al backend, 
popolando l'array `ruoliProfessionista`. In caso di errore, l'array rimane 
vuoto, evitando che rimangano visualizzate opzioni obsolete o incoerenti.

---

#### `onSubmit()`

**Firma:** `onSubmit(): Promise<void>`

**Scopo:** gestisce l'invio del form di registrazione, dalla chiamata al 
backend fino al reindirizzamento in caso di esito positivo.

**Funzionamento:**
1. Estrae dal `registerForm` i valori di ruolo, id del ruolo professionista 
   (se applicabile), nome, cognome, email e password
2. Resetta i flag di errore (`registrationFailed`, `showError`, `serverError`), 
   per garantire uno stato pulito ad ogni nuovo tentativo
3. All'interno di un blocco `try/catch`, chiama il `LoginService` per 
   effettuare la richiesta di registrazione, attendendone la risposta tramite 
   `await firstValueFrom`
4. Verifica l'esito della risposta controllando `response?.body?.success` e 
   lo status code (`201` atteso per una creazione riuscita):
   - se la condizione non è soddisfatta, imposta i flag di errore e un 
     messaggio generico
   - se la registrazione ha successo, chiama nuovamente il `LoginService`, 
     tramite `onRegistrationSuccess()`, per completare il flusso

> [!note] Gestione degli errori
> Il blocco `catch` intercetta eventuali errori della richiesta (es. email 
> già registrata, errore di rete), impostando i flag di errore e recuperando 
> il messaggio restituito dal backend (`e?.error?.message`), con un messaggio 
> di default in caso questo non sia disponibile.


---
---

## Home Page

> [!abstract] Descrizione
> Questa pagina rappresenta la schermata principale dell'applicazione dopo 
> l'accesso, con un'interfaccia differenziata in base al ruolo dell'utente.


### Metodi lifecycle della pagina

#### `ionViewWillEnter()`

**Scopo:** inizializza i dati della pagina ogni volta che questa diventa 
visibile, in base al ruolo dell'utente.

**Funzionamento:**
Si sottoscrive al BehaviorSubject `ruoloUtente` esposto dal `LoginService`, per 
mantenere aggiornato il valore anche in caso di cambiamenti successivi. In 
base al ruolo (`'0'` per utente standard, ogni altro valore per  
professionista), chiama rispettivamente `caricaAttivitaGiornaliere()` oppure 
`getAssociazioniPending()`, `getRichiestePending()` e `getFeedAssociati()`.


---

#### `ionViewWillLeave()`

**Scopo:** effettua la pulizia delle risorse quando la pagina viene abbandonata.

**Funzionamento:**
Emette un valore attraverso il `Subject` `destroy$`, causando la cancellazione 
automatica di tutte le sottoscrizioni RxJS attive nella pagina che utilizzano 
l'operatore `takeUntil(this.destroy$)`.


---
### Metodi implementati
#### `caricaAttivitaGiornaliere()`

**Scopo:** recupera e prepara i dati relativi ai pasti e agli allenamenti 
programmati per la giornata corrente, da mostrare all'utente standard.

**Funzionamento:**
1. Calcola la data odierna in due formati: stringa ISO (per il confronto con 
   i pasti) e oggetto `Date` normalizzato a mezzanotte (per il confronto con 
   gli allenamenti)
2. Tramite `forkJoin`, effettua in parallelo le richieste per ottenere pasti 
   programmati e allenamenti dell'utente
3. Filtra i pasti mantenendo solo quelli con `data_calendario` corrispondente 
   alla data odierna
4. Se sono presenti pasti per la giornata, richiede i dettagli di ciascuno 
   (tramite `getDettagliPasto`), combinando le chiamate con un secondo 
   `forkJoin` innestato tramite `switchMap`
5. Popola gli array `pasti_odierni` e `dettagli_pasti_odierni`, organizzati 
   per tipologia di pasto (Colazione, Pranzo, ecc.)
6. Individua l'allenamento odierno confrontando le date normalizzate

> [!note] Gestione della cancellazione delle sottoscrizioni
> Tutte le subscribe della pagina utilizzano l'operatore `takeUntil(this.destroy$)`, 
> abbinato al `Subject` `destroy$` emesso in `ionViewWillLeave()`. Questo 
> pattern garantisce che le sottoscrizioni RxJS vengano automaticamente 
> annullate quando l'utente abbandona la pagina, prevenendo aggiornamenti di stato su componenti non più visibili.

---

#### `getAssociazioniPending()`

**Scopo:** recupera il numero di associazioni in attesa di approvazione, 
mostrato all'utente con ruolo professionista.

**Funzionamento:**
Chiama il `GestioneUtentiService` per ottenere la lista delle associazioni con stato 
pending, salvandone la lunghezza in `associazioni_pending`.

---

#### `getRichiestePending()`

**Scopo:** recupera il numero di richieste in attesa di approvazione, 
mostrato all'utente con ruolo professionista.

**Funzionamento:**
Analogo a `getAssociazioniPending()`, ma chiama il metodo 
`getRichiestePending()` del `GestioneUtentiService`, salvando il risultato 
in `richieste_pending`.

---

#### `getFeedAssociati()`

**Scopo:** recupera il feed delle attività recenti tracciate dai clienti 
associati al professionista.

**Funzionamento:**
Chiama il `GestioneUtentiService` per ottenere l'elenco delle attività, 
popolando l'array `feedAssociati`, utilizzato nel template per la visualizzazione 
della card "I tuoi Pazienti".

---

#### `isLoggedIn()`

**Firma:** `isLoggedIn(): boolean`

**Scopo:** verifica se un utente ha effettuato l'accesso.

**Funzionamento:**
Restituisce `true` se `ruoloUtente` è diverso da `null`, `false` altrimenti.



>[!example] Parametri:
>Restituisce in output il valore `boolean` che indica lo stato di accesso dell'utente

---
---

## Creazione Pasto Page

> [!abstract] Descrizione
> Questa pagina permette la creazione di un nuovo pasto, tramite l'inserimento 
> di nome e tipologia, seguita dall'inserimento dei relativi alimenti tramite 
> un componente dedicato (`RiempiDettagliComponent`).

### Metodi lifecycle della pagina

#### `ngOnInit()`

**Funzionamento:**
Chiama `GestionePastiService` per recuperare la lista degli alimenti 
disponibili nel database, popolando l'array `alimenti`. Successivamente 
resetta il `pastoForm` e imposta a `false` i flag `showAlreadyExistent` e 
`showRiempiPasto`, per garantire uno stato pulito in vista di un nuovo 
inserimento.

---

#### `ionViewWillEnter()`

**Scopo:** garantisce che il form venga resettato ogni volta che la pagina 
torna visibile, non solo al primo caricamento.

**Funzionamento:**
Resetta il `pastoForm` e imposta `showRiempiPasto` a `false`.

---

### Metodi implementati

#### `onSubmit()`

**Firma:** `onSubmit(): Promise<void>`

**Scopo:** gestisce la creazione di un nuovo pasto, verificandone preventivamente 
l'unicità.

**Funzionamento:**
1. Estrae nome e tipo del pasto dal `pastoForm`
2. In un primo blocco `try/catch`, chiama del `GestionePastiService` per 
   verificare (tramite `checkPasto`) se esiste già un pasto con lo stesso 
   nome e tipo. In caso affermativo, imposta il flag `showAlreadyExistent` 
   e interrompe l'esecuzione
3. Se il pasto non esiste, in un secondo blocco `try/catch` procede alla 
   creazione tramite `creaPasti`, passando anche la data di creazione corrente
4. In caso di risposta con status `201`, salva l'id del pasto appena creato, 
   attiva la visualizzazione del componente di inserimento dettagli 
   (`showRiempiPasto`) e disabilita i campi `nome` e `tipo` del form, per 
   evitarne la modifica durante l'inserimento degli alimenti.




---

#### `annullaCreazione()`

**Firma:** `annullaCreazione(): Promise<void>`

**Scopo:** consente di annullare un pasto appena creato, prima del completamento 
dell'inserimento dei relativi alimenti.

**Funzionamento:**
Chiama il `GestionePastiService` per eliminare il pasto identificato da 
`id_pasto_creato`. In caso di successo (status `201`), mostra un alert di 
conferma tramite `AlertController` e riabilita i campi `nome` e `tipo` del 
form. Indipendentemente dall'esito, nasconde il componente di inserimento 
dettagli e resetta il form.


---




#### `onAlimentoSelezionato()`

**Firma:** `onAlimentoSelezionato(id_alimento: number): Promise<void>`

**Scopo:** gestisce la selezione di un alimento da parte dell'utente, 
ricevuta dal componente di inserimento dettagli.

**Funzionamento:**
Riceve l'id dell'alimento selezionato tramite `@Output` dal 
`RiempiDettagliComponent`, quindi ne recupera i dati completi invocando 
`datiAlimento()`, salvando il risultato in `alimento_selezionato`.

>[!example] Parametri:
>Riceve in input l'id `number` dell'alimento selezionato nel componente



---

#### `datiAlimento()`

**Firma:** `datiAlimento(id_alimento: number): Promise<any>`

**Scopo:** recupera i dati completi di un alimento a partire dal suo id.

**Funzionamento:**
Chiama il `GestionePastiService` per effettuare la richiesta al backend. 
Se la risposta è valida, la restituisce al chiamante; in caso contrario, 
registra un messaggio di log. Gli errori della richiesta vengono intercettati 
e loggati in console.

>[!example] Parametri:
>Riceve in input l'id `number` dell'alimento di cui si vuole recuperare i dati



---

#### `mettiInLista()`

**Firma:** `mettiInLista(alimento: {id_dettaglio: number, name: string, quantita: number})`

**Scopo:** riceve un alimento selezionato e visualizzato, per inviarlo al 
componente di inserimento dettagli.

**Funzionamento:**
Salva l'alimento ricevuto in `alimento_da_aggiungere`, valore poi passato al 
`RiempiDettagliComponent` tramite `@Input`.

**Parametri:**
Riceve in input l'oggetto 'alimento' composto dalle proprietà `id_dettaglio: number, name: string` e `quantita: number`.


>[!example] Parametri:
>Riceve in inputi dati id `number`, nome `string` e quantità `number` dell'alimento da mettere in lista


---

#### `submitRiempi()`

**Firma:** `submitRiempi(alimenti: any[]): Promise<void>`

**Scopo:** completa la creazione del pasto, inserendo nel database la lista 
definitiva degli alimenti selezionati.

**Funzionamento:**
Chiama il `GestionePastiService` per inviare al backend l'elenco degli 
alimenti associati al pasto (`riempiPasto`). In caso di successo (status 
`201`), mostra un alert di conferma, nasconde il componente di inserimento 
dettagli, resetta lo stato della pagina (`id_pasto_creato`, form) e riabilita 
i campi `nome` e `tipo`.

>[!example] Parametri:
Riceve in input un array di any chiamato `alimenti: any[]`.

> [!note] Gestione degli errori
> Il blocco `catch` intercetta un oggetto `e`, e se esso è un errore generico restituisce il messaggio di errore contenuto, altrimenti se `e` possiede uno stato uguale a 403 imposta la variabile `expiredSession` a 'true' per indicare che la sessione corrente è scaduta. 

---

#### `onChiudi()`

**Scopo:** chiude il componente di inserimento dettagli.

**Funzionamento:**
Imposta `showRiempiPasto` a `false` e resetta il `pastoForm`. Il metodo viene 
invocato tramite l'evento `@Output` esposto dal `RiempiDettagliComponent`.

---
---

## Pasti Utente Page

> [!abstract] Descrizione
> Questa pagina gestisce la visualizzazione, modifica, condivisione e votazione 
> dei pasti, con comportamenti differenti in base al ruolo dell'utente che vi 
> accede: un utente standard visualizza il proprio elenco di pasti, mentre un 
> professionista può accedervi in modalità "modifica" o "voto" tramite parametri 
> di navigazione.

> [!note] Dati mock in `pastiUtente`
> L'array `pastiUtente` è inizializzato con valori fittizi ("Pasto 1", "Pasto 2", 
> "Pasto 3"). Tali valori vengono sovrascritti al caricamento reale dei dati tramite `loadPastiUtente()` o `loadSingoloPasto()`.

### Metodi lifecycle della pagina


#### `ionViewWillEnter()`

**Scopo:** determina la modalità di visualizzazione della pagina in base ai 
parametri di navigazione, distinguendo tra accesso da parte dell'utente 
e accesso da parte di un professionista.

**Funzionamento:**
Legge dai query params della route `pasto_id` e `tipo_richiesta`. In base al 
loro valore:
- se `tipo_richiesta` è `'MODIFICA'`, attiva `professionista_modifica` e carica 
  il singolo pasto tramite `loadSingoloPasto()`
- se `tipo_richiesta` è `'VOTO'`, attiva `professionista_vota` e analogamente 
  carica il singolo pasto
- in assenza di questi parametri, carica l'intero elenco dei pasti dell'utente 
  tramite `loadPastiUtente()`

---

#### `ionViewWillLeave()`

**Scopo:** effettua la pulizia dello stato e delle sottoscrizioni quando la 
pagina viene abbandonata.

**Funzionamento:** disattiva i flag `professionista_modifica` e 
`professionista_vota`, ed emette un valore attraverso `destroy$` per annullare 
le sottoscrizioni RxJS attive (tramite `takeUntil`).

---

### Metodi implementati


#### `loadAlimenti()`

**Scopo:** recupera l'elenco completo degli alimenti disponibili nel database.

**Funzionamento:** Chiama il `GestionePastiService` per la sottoscrizione, 
popolando l'array `alimenti`.

---

#### `mostraDettagli()`

**Firma:** `mostraDettagli(pasto: Pasto): Promise<void>`

**Scopo:** carica e mostra i dettagli nutrizionali di un pasto selezionato 
dall'utente.

**Funzionamento:** imposta `pastoSelezionato`, quindi recupera i dettagli 
tramite il `GestionePastiService` e invoca `calcolaDettagliPasto()` per 
calcolare i valori nutrizionali totali.


>[!example] Parametri:
>Riceve in input un oggetto `pasto` di tipo `Pasto` che contiene i dettagli che si vogliono mostrare



---

#### `calcolaDettagliPasto()`

**Firma:** `calcolaDettagli(listaDettagli: any)`

**Scopo:** calcola i valori nutrizionali totali (zuccheri, calorie, grassi, 
carboidrati) sommando i contributi di ciascun alimento del pasto, ponderati 
per la quantità.

**Funzionamento:** azzera preventivamente i quattro totali, quindi itera sugli 
alimenti del pasto sommando i rispettivi valori nutrizionali, proporzionati 
alla quantità effettiva rispetto alla base di 100g fornita dai dati.

**Parametri:**
Un oggetto di tipo `any`.

>[!example] Parametri:
>Riceve in input l'oggetto `listaDettagli` di tipo `any` contenente i valori su cui calcolare i valori nutrizionali

---

#### `chiudiDettagli()`

**Scopo:** chiude la visualizzazione dei dettagli di un pasto, azzerando lo 
stato correlato.

**Funzionamento:** imposta `pastoSelezionato` a `null` e azzera tutti i totali 
nutrizionali.

---

#### `pastoTrack()` / `alimentoTrack()`

**Firma:** `pastoTrack(index: number, pasto: Pasto): string` / 
`alimentoTrack(index: number, alimento: any): string`

**Scopo:** funzioni di tracking utilizzate nei cicli `@for` del template, 
per ottimizzare il re-rendering della lista evitando la ricreazione di 
elementi DOM invariati.

**Funzionamento:** restituiscono una stringa identificativa costruita 
concatenando alcune proprietà rilevanti dell'oggetto (nome, data, tipo per 
il pasto; nome, quantità, calorie per alimento).

>[!example] Parametri:
>Riceve in input `index: number` cioè l'indice del ciclo for, l'oggetto di nome `pasto` di tipo `Pasto` e l'oggetto di nome `alimento` di tipo `any` come elementi di cui effettuare il tracking
>Restituisce in output una `string` che sarà il contenuto visualizzato


---

#### `getAlimento()` / `datiAlimento()`

**Firma:** `datiAlimento(id_alimento: number): Promise<any>`

**Scopo:** recuperano i dati completi di un alimento a partire dal suo id, 
per la visualizzazione delle informazioni di dettaglio.

**Funzionamento:** `getAlimento()` funge da wrapper che invoca `datiAlimento()` 
e ne salva il risultato in `alimentoSelezionato`. `datiAlimento()` effettua 
la richiesta tramite il `GestionePastiService`.

>[!example] Parametri:
>Prende in ingresso l'`id_alimento` di tipo  `number` di cui ottenere i dati



---

#### `modificaPasto()`

**Firma:** `modificaPasto(pasto: Pasto): Promise<void>`

**Scopo:** Prepara la modifica di un pasto caricandone i dettagli per passarli al component di modifica.

**Funzionamento:** Recupera i dettagli del pasto da 
modificare tramite Service  chiamando `getDettagliPasto()` e attiva la visualizzazione del componente `ModificaDettagliComponent` (`viewModifica = true`). 


>[!example] Parametri:
>Prende in input l'oggetto `pasto` di tipo `Pasto` di cui modificare i dati




---

#### `confermaModificaPasto()`

**Firma:** `confermaPasto(modifiche: any[]): Promise<void>`

**Scopo:** ultima la modifica di un pasto esistente inviando i dati contenuti nell'array in ingresso tramite una chiamata al Service.

**Funzionamento:** ricava l'id del pasto in corso di modifica e lo salva nella costante `id_pasto_modificato`, poi invia le modifiche al backend invocando il metodo `modificaPasto` del `GestionePastiService` fornendo come parametri: `id_pasto_modificato` e lo stesso array con le modifiche che ha già ricevuto in ingresso e infine ricarica l'elenco dei pasti.

>[!example] Parametri:
>Prende in input un array di modifiche chiamato `modifiche` di tipo `any[]` emesso dal component di modifica; 

---

#### `getVotoPasto()`

**Firma:** `getVotoPasto(id_pasto: number)`

**Scopo:** calcola la valutazione media di un pasto a partire dai voti ricevuti.

**Funzionamento:** si sottoscrive al `GestioneBachecaService` per recuperare i 
voti associati al pasto tramite la funzione `getVotiAttivita`, se esistono dei voti ne calcola la media e la salva in una variabile `voto_pasto_caricato`, altrimenti la imposta a 0.

>[!example] Parametri:
>Prende in input l'id `number` del pasto di cui su vuole recuperare il voto

---

#### `onChiudi()`

**Scopo:** chiude la visualizzazione del componente di modifica pasto.

**Funzionamento:** imposta `viewModifica` a `false`.

---

### Metodi lato utente

#### `loadPastiUtente()`

**Scopo:** carica l'elenco completo dei pasti associati all'utente corrente.

**Funzionamento:** effettua una sottoscrizione al `GestionePastiService`, popolando l'array 
`pastiUtente` tramite una chiamata a `getPastiUtente`.

---

#### `apriRichiesta()`

**Firma:** `apriRichiesta(id_pasto: number)`

**Scopo:** prepara l'invio di una richiesta relativa a un pasto (es. richiesta 
di modifica) ad un professionista, recuperando l'elenco dei professionisti 
disponibili nell'ambito alimentare.

**Funzionamento:** in contemporanea all'apertura di un `ion-modal` nel template, salva l'id del pasto in `id_pasto_richiesta`, quindi effettua una sottoscrizione al `GestioneUtentiService` per recuperare le associazioni dell'utente tramite il metodo `getAssociazioniUtente`filtrando solo quelle con un professionista che ha `ruolo === 1` (alimentare).

>[!example] Parametri:
>Prende in input l'id `number` del pasto di cui si vuole inviare la richiesta

---

#### `inviaRichiesta()`

**Firma:** `inviaRichiesta(id_prof: number, tipo: string): Promise<void>`

**Scopo:** invia una richiesta di modifica o valutazione a un professionista relativa al pasto 
selezionato.

**Funzionamento:** costruisce un oggetto `pacchetto` contenente i dati della richiesta e lo invia al professionista identificato da `id_prof` tramite una chiamata asincrona al `GestioneUtentiService`. In caso di successo (status `201`), mostra un alert di conferma.

>[!example] Parametri:
>Prende in input l'id `number` del professionista al quale si vuole inviare la richiesta
>e la `stringa` relativa al tipo di richiesta che si vuole effettuare

---

#### `condividiPasto()`

**Firma:** `condividiPasto(id_pasto: number): Promise<void>`

**Scopo:** condivide un pasto nella bacheca, evitando condivisioni duplicate.

**Funzionamento:** verifica preventivamente, tramite una chiamata asincrona al `GestioneBachecaService`, se il pasto è già stato condiviso; in tal caso interrompe l'esecuzione e lo notifica all'utente, altrimenti procede, con una seconda chiamata asincrona al Service, la condivisione del pasto, mostrando un alert di conferma in caso di successo.

>[!example] Parametri:
>Prende in input l'id `number` del pasto che si vuole condividere in bacheca

---

#### `eliminaPasto()`

**Firma:** `eliminaPasto(id_pasto: number): Promise<void>`

**Scopo:** elimina un pasto dell'utente.

**Funzionamento:** chiama il `GestionePastiService` per l'eliminazione, 
ricaricando l'elenco dei pasti al termine dell'operazione.

>[!example] Parametri:
>Prende in input l'id `number` del pasto che si vuole eliminare

---

### Metodi lato professionista


#### `loadSingoloPasto()`

**Firma:** `loadSingoloPasto(id_pasto: number): Promise<void>`

**Scopo:** carica un singolo pasto, utilizzato quando la pagina viene 
raggiunta da un professionista in modalità modifica o voto.

**Funzionamento:** effettua una sottoscrizione al `GestionePastiService` e, grazie alla chiamata `getPastoById`, recupera i dati del pasto desiderato, dopodichè assegna il 
risultato (racchiuso in un array) alla variabile `pastiUtente` per riutilizzare 
la stessa struttura dati impiegata nella visualizzazione lato utente.

>[!example] Parametri:
>Prende in input l'id `number` del pasto che si vuole caricare

---

#### `votaPasto()`

**Firma:** `votaPasto(id_pasto: number): Promise<void>`

**Scopo:** aprire la modalità voto se non è aperta, all'apertura carica i voti precedentemente assegnati.

**Funzionamento:** se la modalità voto è già attiva, la disattiva e interrompe 
l'esecuzione. Altrimenti, salva l'id del pasto da votare, ne recupera le informazioni chiamando `getVotoPasto()` e attiva `modalita_voto`.

>[!example] Parametri:
>Prende in input l'id `number` del pasto.


---

#### `inviaVoto()`

**Firma:** `inviaVoto(voto: number, id_pasto: number): Promise<void>`

**Scopo:** assegnare voto ad un pasto e inviarne la valutazione assegnata da parte del professionista.

**Funzionamento:** costruisce l'oggetto `voto_da_inviare` contenente `id_pasto` , il `voto` assegnato e la `tipologia`,  e lo invia all'utente chiamando il `GestioneBachecaService`. In caso di successo, mostra un alert con un pulsante che reindirizza l'utente alla pagina delle richieste (`/richieste`), quindi disattiva la modalità voto.

>[!example] Parametri:
>Prende in input il voto `number` assegnato e l'id `number` del pasto che si ha appena votato.

---
---


## Creazione Allenamento Page

> [!abstract] Descrizione
> Questa pagina permette la creazione di un nuovo allenamento, tramite 
> l'inserimento di nome, giorno (selezionato da un calendario personalizzato) 
> e durata, seguita dall'inserimento dei relativi esercizi tramite un 
> componente dedicato (`RiempiDettagliComponent`).

### Metodi lifecycle della pagina

#### `ngOnInit()`

**Funzionamento:**
Chiama `GestioneAllenamentiService` per recuperare la lista degli esercizi 
disponibili nel database, popolando l'array `esercizi`. Successivamente 
resetta l'`allenamentoForm` e imposta a `false` i flag `showAlreadyExistent` 
e `showRiempiAllenamento`, per garantire uno stato pulito in vista di un 
nuovo inserimento.

---

#### `ionViewWillEnter()`

**Scopo:** garantisce che il form e i relativi flag vengano ripristinati 
ogni volta che la pagina torna visibile, non solo al primo caricamento.

**Funzionamento:**
Resetta l'`allenamentoForm`, i flag `showAlreadyExistent` e 
`showRiempiAllenamento`, e riabilita il pulsante del calendario 
(`pulsanteCalendarioAbilitato = true`).

---

### Metodi implementati

#### `incrementoDurata()` / `decrementoDurata()`

**Scopo:** gestiscono l'incremento e il decremento del valore del campo 
`durata` del form, tramite i pulsanti "+"/"-" nell'interfaccia.

**Funzionamento:** leggono il valore corrente del campo `durata` (o `0` se 
non impostato) e lo aggiornano di un'unità. `decrementoDurata()` include un 
controllo per evitare che il valore scenda sotto lo zero.

---

#### `apriModalCalendario()`

**Scopo:** apre manualmente il modal contenente il calendario per la 
selezione del giorno di allenamento.

**Funzionamento:** invoca `present()` sul riferimento al modal ottenuto 
tramite `@ViewChild('modalCalendario')`.

---

#### `onSubmit()`

**Firma:** `onSubmit(): Promise<void>`

**Scopo:** gestisce la creazione di un nuovo allenamento, verificando 
preventivamente che non esista già un allenamento nello stesso giorno.

**Funzionamento:**
1. Estrae nome, giorno e durata dall'`allenamentoForm`. Il giorno, ricevuto 
   in formato ISO con orario incluso, viene troncato tramite `split('T')[0]` 
   per ottenere la sola data
2. In un primo blocco `try/catch`, chiama `GestioneAllenamentiService` per 
   verificare (tramite `checkAllenamento`) se esiste già un allenamento 
   programmato per lo stesso giorno. In caso affermativo, imposta il flag 
   `showAlreadyExistent` e interrompe l'esecuzione
3. Se non esiste, in un secondo blocco `try/catch` procede alla creazione 
   tramite `creaAllenamenti`, passando anche la data di creazione corrente
4. In caso di risposta con status `201`, salva l'id dell'allenamento appena 
   creato, attiva la visualizzazione del componente di inserimento dettagli 
   (`showRiempiAllenamento`), disabilita i campi del form e il pulsante del 
   calendario, per evitarne la modifica durante l'inserimento degli esercizi

---

#### `annullaCreazione()`

**Firma:** `annullaCreazione(): Promise<void>`

**Scopo:** consente di annullare un allenamento appena creato, prima del 
completamento dell'inserimento dei relativi esercizi.

**Funzionamento:**
Chiama `GestioneAllenamentiService` per eliminare l'allenamento identificato 
da `id_allenamento_creato`. In caso di successo (status `201`), mostra un 
alert di conferma tramite `AlertController`, riabilita i campi del form e il 
pulsante del calendario. Indipendentemente dall'esito, nasconde il componente 
di inserimento dettagli e resetta il form.

---

#### `onEsercizioSelezionato()`

**Firma:** `onEsercizioSelezionato(id_esercizio: number)`

**Scopo:** gestisce la selezione di un esercizio da parte dell'utente, 
ricevuta dal componente di inserimento dettagli.

**Funzionamento:**
Riceve l'id dell'esercizio selezionato tramite `@Output` dal componente di 
riempimento, quindi ne recupera i dati completi invocando `datiEsercizio()`, 
salvando il risultato in `esercizio_selezionato`.

>[!example] Parametri:
>Riceve in input l'id `number` dell'esercizio selezionato nel componente

---

#### `datiEsercizio()`

**Firma:** `datiEsercizio(id_esercizio: number): Promise<any>`

**Scopo:** recupera i dati completi di un esercizio a partire dal suo id.

**Funzionamento:**
Chiama `GestioneAllenamentiService` per effettuare la richiesta al backend. 
Se la risposta è valida, la restituisce al chiamante; in caso contrario, 
registra un messaggio di log. Gli errori della richiesta vengono intercettati 
e loggati in console.

>[!example] Parametri:
>Riceve in input l'id `number` dell'esercizio di cui si vuole recuperare i dati

---

#### `mettiInLista()`

**Firma:** `mettiInLista(esercizio: any)`

**Scopo:** riceve un esercizio selezionato e visualizzato, per inviarlo al 
componente di inserimento dettagli.

**Funzionamento:**
Salva l'esercizio ricevuto in `esercizio_da_aggiungere`, valore poi passato 
al componente di riempimento tramite `@Input`. Resetta inoltre 
`esercizio_selezionato` a `null`, chiudendo la visualizzazione delle info 
precedentemente mostrate.

>[!example] Parametri:
>Riceve in input l'oggetto `esercizio` selezionato e configurato dal componente info-dettagli

---

#### `submitRiempi()`

**Firma:** `submitRiempi(esercizi: any[]): Promise<void>`

**Scopo:** completa la creazione dell'allenamento, inserendo nel database la 
lista definitiva degli esercizi selezionati.

**Funzionamento:**
Chiama `GestioneAllenamentiService` per inviare al backend l'elenco degli 
esercizi associati all'allenamento (`riempiAllenamento`). In caso di successo 
(status `201`), mostra un alert di conferma, nasconde il componente di 
inserimento dettagli, resetta il form e riabilita i relativi campi e il 
pulsante del calendario.

>[!example] Parametri:
>Riceve in input un array di any chiamato `esercizi: any[]`

> [!note] Gestione degli errori
> Il blocco `catch` intercetta un oggetto `e`, e se esso è un errore generico 
> restituisce il messaggio di errore contenuto, altrimenti se `e` possiede 
> uno stato uguale a 403 imposta la variabile `expiredSession` a `true` per 
> indicare che la sessione corrente è scaduta.

---

#### `onChiudi()`

**Scopo:** chiude il componente di inserimento dettagli senza completare 
l'inserimento.

**Funzionamento:**
Imposta `showRiempiAllenamento` a `false` e resetta l'`allenamentoForm`.

---
---

## Allenamenti Utente Page

> [!abstract] Descrizione
> Questa pagina gestisce la visualizzazione, modifica, condivisione e votazione 
> degli allenamenti, con comportamenti differenti in base al ruolo dell'utente 
> che vi accede: un utente standard visualizza il proprio elenco di allenamenti, 
> mentre un professionista può accedervi in modalità "modifica" o "voto" tramite 
> parametri di navigazione.

### Metodi lifecycle della pagina

#### `ngOnInit()`

**Funzionamento:** chiama `loadEsercizi()` per popolare l'elenco degli 
esercizi disponibili, utilizzato successivamente nella visualizzazione dei 
dettagli.

---

#### `ionViewWillEnter()`

**Scopo:** determina la modalità di visualizzazione della pagina in base ai 
parametri di navigazione, distinguendo tra accesso da parte dell'utente e 
accesso da parte di un professionista.

**Funzionamento:**
Legge dai query params della route `allenamento_id` e `tipo_richiesta`. In 
base al loro valore:
- se `tipo_richiesta` è `'MODIFICA'`, attiva `professionista_modifica` e carica 
  il singolo allenamento tramite `loadSingoloAllenamento()`
- se `tipo_richiesta` è `'VOTA'`, attiva `professionista_vota` e analogamente 
  carica il singolo allenamento
- in assenza di questi parametri, carica l'intero elenco degli allenamenti 
  dell'utente tramite `loadAllenamentiUtente()`

---

#### `ionViewWillLeave()`

**Scopo:** effettua la pulizia dello stato e delle sottoscrizioni quando la 
pagina viene abbandonata.

**Funzionamento:** disattiva i flag `professionista_modifica` e 
`professionista_vota`, ed emette un valore attraverso `destroy$` per annullare 
le sottoscrizioni RxJS attive (tramite `takeUntil`).

---

### Metodi implementati

#### `mostraDettagli()`

**Firma:** `mostraDettagli(allenamento: Allenamento): Promise<void>`

**Scopo:** carica e mostra i dettagli degli esercizi di un allenamento 
selezionato dall'utente.

**Funzionamento:** imposta `allenamentoSelezionato`, azzera 
`dettagliAllenamento` per ripulire lo stato precedente, quindi recupera i 
dettagli tramite il `GestioneAllenamentiService` chiamando `getDettagliAllenamento`.

>[!example] Parametri:
>Riceve in input un oggetto `allenamento` di tipo `Allenamento` di cui si 
>vogliono mostrare i dettagli

---

#### `allenamentoTrack()` / `esercizioTrack()`

**Firma:** `allenamentoTrack(index: number, allenamento: any): string` / 
`esercizioTrack(index: number, esercizio: any): string`

**Scopo:** funzioni di tracking utilizzate nei cicli `@for` del template, 
per ottimizzare il re-rendering della lista evitando la ricreazione di 
elementi DOM invariati.

**Funzionamento:** restituiscono una stringa identificativa costruita 
concatenando alcune proprietà rilevanti dell'oggetto (nome, data, data di 
creazione per l'allenamento; nome, serie, ripetizioni, pesi e riposo per 
l'esercizio).

>[!example] Parametri:
>Ricevono in input `index: number`, cioè l'indice del ciclo for, e l'oggetto 
>(`allenamento` o `esercizio`) di cui effettuare il tracking
>Restituiscono in output una `string` che sarà il contenuto visualizzato

---

#### `getEsercizio()` / `datiEsercizio()`

**Firma:** `datiEsercizio(id_esercizio: number): Promise<any>`

**Scopo:** recuperano i dati completi di un esercizio a partire dal suo id, 
per la visualizzazione delle informazioni di dettaglio.

**Funzionamento:** `getEsercizio()` funge da wrapper che invoca `datiEsercizio()` 
e ne salva il risultato in `esercizioSelezionato`. `datiEsercizio()` effettua 
la richiesta tramite il `GestioneAllenamentiService`, distinguendo nel blocco 
`catch` tra un errore generico (istanza di `Error`) e un errore `404` 
(esercizio non trovato).

>[!example] Parametri:
>Prende in ingresso l'`id_esercizio` di tipo `number` di cui ottenere i dati

---

#### `chiudiDettagli()`

**Scopo:** chiude la visualizzazione dei dettagli di un allenamento.

**Funzionamento:** imposta `allenamentoSelezionato` a `null`.

---

#### `modificaAllenamento()`

**Firma:** `modificaAllenamento(allenamento: any): Promise<void>`

**Scopo:** prepara la modifica di un allenamento caricandone i dettagli per 
passarli al component di modifica.

**Funzionamento:** recupera i dettagli dell'allenamento da modificare 
tramite Service chiamando `getDettagliAllenamento()` e attiva la 
visualizzazione del componente `ModificaDettagliComponent` (`viewModifica = true`).

>[!example] Parametri:
>Prende in input l'oggetto `allenamento` di cui modificare i dati

---

#### `confermaModificaAllenamento()`

**Firma:** `confermaModificaAllenamento(modifiche: any[]): Promise<void>`

**Scopo:** ultima la modifica di un allenamento esistente inviando i dati 
contenuti nell'array in ingresso tramite una chiamata al Service.

**Funzionamento:** ricava l'id dell'allenamento in corso di modifica e lo 
salva nella costante `id_allenamento_modificato`, poi invia le modifiche al 
backend invocando il metodo `modificaAllenamento` del 
`GestioneAllenamentiService` fornendo come parametri `id_allenamento_modificato` 
e lo stesso array con le modifiche che ha già ricevuto in ingresso, infine 
ricarica l'elenco degli allenamenti.

>[!example] Parametri:
>Prende in input un array di modifiche chiamato `modifiche` di tipo `any[]` 
>emesso dal component di modifica

---

#### `getVotoAllenamento()`

**Firma:** `getVotoAllenamento(id_allenamento: number)`

**Scopo:** calcola la valutazione media di un allenamento a partire dai voti 
ricevuti.

**Funzionamento:** si sottoscrive al `GestioneBachecaService` per recuperare 
i voti associati all'allenamento tramite la funzione `getVotiAttivita`, se 
esistono dei voti ne calcola la media e la salva nella variabile 
`voto_allenamento_caricato`, altrimenti la imposta a 0.

>[!example] Parametri:
>Prende in input l'id `number` dell'allenamento di cui si vuole recuperare 
>il voto

---

#### `onChiudi()`

**Scopo:** chiude la visualizzazione del componente di modifica allenamento.

**Funzionamento:** imposta `viewModifica` a `false`.

---

### Metodi lato utente

#### `loadAllenamentiUtente()`

**Scopo:** carica l'elenco completo degli allenamenti associati all'utente 
corrente.

**Funzionamento:** effettua una sottoscrizione al `GestioneAllenamentiService`, 
popolando l'array `allenamentiUtente` tramite una chiamata a 
`getAllenamentiUtente`.

---

#### `apriRichiesta()`

**Firma:** `apriRichiesta(id_allenamento: number)`

**Scopo:** prepara l'invio di una richiesta relativa a un allenamento (es. 
richiesta di modifica) ad un professionista, recuperando l'elenco dei 
professionisti disponibili nell'ambito allenamenti.

**Funzionamento:** salva l'id dell'allenamento in `id_allenamento_richiesta`, 
quindi effettua una sottoscrizione al `GestioneUtentiService` per recuperare 
le associazioni dell'utente tramite il metodo `getAssociazioniUtente`, 
filtrando solo quelle con un professionista che ha `ruolo === 2` (allenamenti).

>[!example] Parametri:
>Prende in input l'id `number` dell'allenamento di cui si vuole inviare la 
>richiesta

---

#### `inviaRichiesta()`

**Firma:** `inviaRichiesta(id_prof: number, tipo: string): Promise<void>`

**Scopo:** invia una richiesta di modifica o valutazione a un professionista 
relativa all'allenamento selezionato.

**Funzionamento:** costruisce un oggetto `pacchetto` contenente i dati della 
richiesta e lo invia al professionista identificato da `id_prof` tramite una 
chiamata asincrona al `GestioneUtentiService`. In caso di successo (status 
`201`), mostra un alert di conferma.

>[!example] Parametri:
>Prende in input l'id `number` del professionista al quale si vuole inviare 
>la richiesta e la `stringa` relativa al tipo di richiesta che si vuole 
>effettuare

---

#### `condividiAllenamento()`

**Firma:** `condividiAllenamento(id_allenamento: number): Promise<void>`

**Scopo:** condivide un allenamento nella bacheca, evitando condivisioni 
duplicate.

**Funzionamento:** verifica preventivamente, tramite una chiamata asincrona 
al `GestioneBachecaService`, se l'allenamento è già stato condiviso; in tal 
caso mostra un alert che ne notifica la presenza in bacheca e interrompe 
l'esecuzione. Altrimenti procede, con una seconda chiamata asincrona al 
Service, alla condivisione dell'allenamento, mostrando un alert di conferma 
in caso di successo.

>[!example] Parametri:
>Prende in input l'id `number` dell'allenamento che si vuole condividere in 
>bacheca

---

#### `eliminaAllenamento()`

**Firma:** `eliminaAllenamento(id: number): Promise<void>`

**Scopo:** elimina un allenamento dell'utente.

**Funzionamento:** chiama il `GestioneAllenamentiService` per l'eliminazione, 
ricaricando l'elenco degli allenamenti al termine dell'operazione.

>[!example] Parametri:
>Prende in input l'id `number` dell'allenamento che si vuole eliminare

---

### Metodi lato professionista

#### `loadSingoloAllenamento()`

**Firma:** `loadSingoloAllenamento(id_allenamento: number): Promise<void>`

**Scopo:** carica un singolo allenamento, utilizzato quando la pagina viene 
raggiunta da un professionista in modalità modifica o voto.

**Funzionamento:** effettua una sottoscrizione al `GestioneAllenamentiService` 
e, grazie alla chiamata `getAllenamentoById`, recupera i dati 
dell'allenamento desiderato, dopodiché assegna il risultato (racchiuso in un 
array) alla variabile `allenamentiUtente` per riutilizzare la stessa 
struttura dati impiegata nella visualizzazione lato utente.

>[!example] Parametri:
>Prende in input l'id `number` dell'allenamento che si vuole caricare

---

#### `votaAllenamento()`

**Firma:** `votaAllenamento(id_allenamento: number): Promise<void>`

**Scopo:** aprire la modalità voto se non è aperta, all'apertura carica i 
voti precedentemente assegnati.

**Funzionamento:** se la modalità voto è già attiva, la disattiva e 
interrompe l'esecuzione. Altrimenti, salva l'id dell'allenamento da votare, 
ne recupera le informazioni chiamando `getVotoAllenamento()` e attiva 
`modalita_voto`.

>[!example] Parametri:
>Prende in input l'id `number` dell'allenamento

---

#### `inviaVoto()`

**Firma:** `inviaVoto(voto: number, id_allenamento: number): Promise<void>`

**Scopo:** assegnare voto ad un allenamento e inviarne la valutazione 
assegnata da parte del professionista.

**Funzionamento:** costruisce l'oggetto `voto_da_inviare` contenente 
`id_allenamento`, il `voto` assegnato e la `tipologia`, e lo invia chiamando 
il `GestioneBachecaService`. In caso di successo, mostra un alert con un 
pulsante che reindirizza l'utente alla pagina delle richieste (`/richieste`), 
quindi disattiva la modalità voto.

>[!example] Parametri:
>Prende in input il voto `number` assegnato e l'id `number` dell'allenamento 
>che si ha appena votato



---
---

## Calendario Page

> [!abstract] Descrizione
> Questa pagina funge da contenitore per il componente `CalendarioComponent`, 
> incapsulandolo all'interno del layout standard dell'applicazione (header, 
> content).

### Metodi implementati

#### `ionViewWillEnter()`

**Scopo:** garantisce che gli eventi del calendario vengano ricaricati ogni 
volta che la pagina torna visibile, così da riflettere eventuali modifiche 
apportate altrove nell'applicazione (es. creazione di un nuovo pasto o 
allenamento da un'altra pagina).

**Funzionamento:** ottiene il riferimento al `CalendarioComponent` figlio 
tramite `@ViewChild`, chiamando direttamente il metodo pubblico 
`loadAllEvents()` esposto dal componente.

---
---

## Profilo Page

> [!abstract] Descrizione
> Questa pagina mostra e permette la modifica dei dati del profilo utente 
> (anagrafici, informazioni fisiche, password), oltre a visualizzare le 
> associazioni con professionisti (lato utente) o con clienti (lato 
> professionista), con contenuti differenziati in base al ruolo.

### Metodi lifecycle della pagina

#### `ngOnInit()`

**Funzionamento:** chiama `loadDatiUtente()` per popolare i dati anagrafici 
e le informazioni dell'utente al primo caricamento della pagina.

---

#### `ionViewWillEnter()`

**Scopo:** carica i dati pertinenti al ruolo dell'utente ogni volta che la 
pagina torna visibile.

**Funzionamento:** si sottoscrive alla proprietà `ruoloUtente` del 
`LoginService`. Se il ruolo è `'0'` (utente standard), chiama 
`loadDatiUtente()` e `loadAssociazioniUtente()`; altrimenti chiama 
`loadAssociazioniProfessionista()`.

---

### Metodi implementati

#### `loadDatiUtente()`

**Firma:** `loadDatiUtente(): Promise<void>`

**Scopo:** carica i dati anagrafici e le informazioni fisiche dell'utente 
corrente.

**Funzionamento:** decodifica il token JWT salvato nel `localStorage` per 
ricavare l'id dell'utente, salvandolo in `id_utente`. Chiama quindi il 
`GestioneUtentiService` per recuperare sia i dati anagrafici (`dati_utente`) 
sia le informazioni fisiche (`info_utente`).

---

#### `modificaEta()` / `modificaPeso()` / `modificaAltezza()` / `modificaCondizioni()`

**Scopo:** attivano la modalità di modifica per il rispettivo campo 
dell'informazione fisica dell'utente.

**Funzionamento:** impostano a `true` il flag booleano corrispondente 
(`flag_eta`, `flag_peso`, `flag_altezza`, `flag_condizioni`), utilizzato nel 
template per mostrare un campo di input al posto del valore statico.

---

#### `onSubmitPassword()`

**Scopo:** gestisce il cambio della password dell'utente, validando che la 
nuova password e la sua conferma coincidano.

**Funzionamento:** recupera i tre valori del `passwordForm`. Se 
`nuovaPassword` non coincide con `confermaPassword`, imposta il flag 
`controlloNuovaPassword`. Altrimenti, chiama il `GestioneUtentiService` per 
aggiornare la password sul backend tramite `aggiornaPassword`; in caso di 
successo, mostra un alert di conferma, chiude il modal e resetta il form.

---

#### `chiudiModal()`

**Scopo:** chiude il modal di cambio password, ripristinando lo stato del 
form.

**Funzionamento:** imposta `modalOpen` a `false`, azzera i flag di 
validazione e resetta il `passwordForm`.

---

#### `onSubmit()`

**Firma:** `Submit(age: string | number, weight: string | number, height: string | number, condition: string | number): Promise<void>`

**Scopo:** aggiorna una singola informazione fisica dell'utente (età, peso, 
altezza o condizioni mediche), in base a quale valore tra i quattro 
parametri risulta valorizzato.

**Funzionamento:** tramite una catena di `if/else if`, individua quale dei 
quattro valori è stato effettivamente modificato, aggiorna il corrispondente 
campo di `info_utente` e invia l'intero oggetto aggiornato al backend 
chiamando `riempiInfo` del `GestioneUtentiService`. Se nessuno dei quattro 
valori risulta valorizzato, disattiva tutti i flag di modifica e interrompe 
l'esecuzione.

>[!example] Parametri:
>Riceve in input `age`, `weight`, `height` e `condition`, ciascuno di tipo 
>`string | number`, rappresentanti il valore aggiornato del rispettivo 
>campo fisico

---

#### `numeriEta()` / `numeriPesoAltezza()`

**Firma:** `numeriEta(event: KeyboardEvent)` / `numeriPesoAltezza(event: KeyboardEvent)`

**Scopo:** limitano l'input dei campi numerici (età, peso, altezza) 
impedendo l'inserimento di caratteri non numerici e limitando il numero di 
cifre digitabili (2 per l'età, 3 per peso/altezza).

**Funzionamento:** intercettano l'evento `keydown`, verificando tramite 
espressione regolare (`/^\d$/`) che il tasto premuto sia una cifra e che la 
lunghezza attuale del valore non abbia già raggiunto il limite; in caso 
contrario, chiamano `preventDefault()` per bloccare l'inserimento.

>[!example] Parametri:
>Ricevono in input l'`event` di tipo `KeyboardEvent` generato dalla pressione 
>di un tasto sul campo di input

---

#### `loadAssociazioniProfessionista()`

**Scopo:** carica l'elenco delle associazioni tra il professionista corrente 
e i propri clienti.

**Funzionamento:** effettua una sottoscrizione al `GestioneUtentiService`, 
popolando `associazioni` tramite una chiamata a `getAssociazioniProfessionista` 
e filtrando in `utenti_associati` solo quelle con stato `'ACCETTATA'`.

---

#### `loadAssociazioniUtente()`

**Scopo:** carica l'elenco delle associazioni dell'utente con i 
professionisti, arricchendo ciascuna con il ruolo specifico del professionista 
associato.

**Funzionamento:** recupera le associazioni dell'utente chiamando 
`getAssociazioniUtente`, quindi per ciascuna (tramite `switchMap` e 
`forkJoin`) effettua una chiamata aggiuntiva a `getRuoloProfessionista` per 
ottenere il ruolo del professionista associato, combinando i due risultati 
in un unico oggetto. Se l'utente non ha associazioni, restituisce direttamente 
un array vuoto (`of([])`). Popola infine `associazioni` e filtra 
`utenti_associati` come nel metodo precedente.


---
---

## Richieste Page

> [!abstract] Descrizione
> Questa pagina gestisce le richieste di associazione tra utenti e 
> professionisti, oltre alle richieste di modifica/valutazione di pasti e 
> allenamenti, con funzionalità differenziate in base al ruolo: un utente 
> standard può cercare professionisti e inviare richieste di associazione, 
> mentre un professionista gestisce le richieste ricevute (accettazione, 
> rifiuto) sia per le associazioni sia per le richieste di modifica/voto.

### Metodi lifecycle della pagina

#### `ionViewWillEnter()`

**Scopo:** carica i dati pertinenti al ruolo dell'utente ogni volta che la 
pagina torna visibile.

**Funzionamento:** si sottoscrive alla proprietà `ruoloUtente` del 
`LoginService`. Se il ruolo è `'0'` (utente standard), chiama 
`loadProfessionisti()`, `loadAssociazioniUtente()` e `loadRichiesteUtente()`; 
altrimenti chiama `loadAssociazioniProfessionista()` e 
`loadRichiesteProfessionista()`.

---

#### `ionViewWillLeave()`

**Scopo:** effettua la pulizia delle sottoscrizioni quando la pagina viene 
abbandonata.

**Funzionamento:** emette un valore attraverso `destroy$`, annullando le 
sottoscrizioni RxJS attive tramite `takeUntil`.

---

### Metodi lato utente

#### `loadProfessionisti()`

**Firma:** `loadProfessionisti(): Promise<void>`

**Scopo:** carica l'elenco dei professionisti disponibili, a cui l'utente 
può inviare una richiesta di associazione.

**Funzionamento:** effettua una sottoscrizione al `GestioneUtentiService`, 
popolando `professionisti` tramite una chiamata a `getUtentiByRuolo`, 
filtrando gli utenti con ruolo `3` ottenendo gli utenti con ruolo > 0.

---

#### `loadAssociazioniUtente()`

**Firma:** `loadAssociazioniUtente(): Promise<void>`

**Scopo:** carica l'elenco delle associazioni dell'utente con i 
professionisti, arricchendo ciascuna con il ruolo specifico del 
professionista associato.

**Funzionamento:** recupera le associazioni dell'utente chiamando 
`getAssociazioniUtente`, quindi per ciascuna (tramite `switchMap` e 
`forkJoin`) effettua una chiamata aggiuntiva a `getRuoloProfessionista` per 
ottenere il ruolo del professionista associato, combinando i due risultati 
in un unico oggetto. Popola `associazioni` e filtra `associazioni_in_corso` 
per quelle con stato `'ACCETTATA'`.

---

#### `loadRichiesteUtente()`

**Scopo:** carica l'elenco delle richieste di associazione inviate 
dall'utente.

**Funzionamento:** effettua una sottoscrizione al `GestioneUtentiService`, 
popolando l'array `richieste` tramite una chiamata a `getRichiesteUtente`.

---

#### `checkRichieste()`

**Firma:** `checkRichieste(id_professionista: number): boolean`

**Scopo:** verifica se esiste già un'associazione (in qualsiasi stato) con 
un determinato professionista, per evitare l'invio di richieste duplicate.

**Funzionamento:** itera sull'array `associazioni`, restituendo `true` se 
trova una corrispondenza con l'id del professionista fornito.

>[!example] Parametri:
>Prende in input l'id `number` del professionista di cui si vuole verificare 
>l'esistenza di un'associazione
>Restituisce in output un `boolean` che indica se esiste già un'associazione 
>con quel professionista

---

#### `inviaRichiesta()`

**Firma:** `inviaRichiesta(id_professionista: number): Promise<void>`

**Scopo:** invia una richiesta di associazione a un professionista.

**Funzionamento:** verifica preventivamente, chiamando `checkRichieste()`, 
che non esista già un'associazione con quel professionista; in tal caso 
interrompe l'esecuzione. Altrimenti, invia la richiesta chiamando 
`creaAssociazione` del `GestioneUtentiService`, mostrando un alert di 
conferma e ricaricando le associazioni in caso di successo.

>[!example] Parametri:
>Prende in input l'id `number` del professionista a cui si vuole inviare la 
>richiesta di associazione

---

#### `annullaAssociazione()`

**Firma:** `annullaAssociazione(id_associazione: number): Promise<void>`

**Scopo:** annulla un'associazione esistente (o una richiesta pending) da 
parte dell'utente.

**Funzionamento:** chiama `annullaAssociazione` del `GestioneUtentiService`; 
in caso di successo, ricarica le associazioni tramite `loadAssociazioniUtente()`.

>[!example] Parametri:
>Prende in input l'id `number` dell'associazione da annullare

---

### Metodi lato professionista

#### `loadRichiesteProfessionista()`

**Scopo:** carica l'elenco delle richieste (di modifica o voto) ricevute dal 
professionista.

**Funzionamento:** effettua una sottoscrizione al `GestioneUtentiService`, 
popolando l'array `richieste` tramite una chiamata a 
`getRichiesteProfessionista`.

---

#### `loadAssociazioniProfessionista()`

**Scopo:** carica l'elenco delle associazioni del professionista con i 
propri clienti, distinguendo quelle in attesa da quelle già accettate.

**Funzionamento:** recupera le associazioni chiamando 
`getAssociazioniProfessionista`, filtrando `richieste_associazioni` (stato 
`'PENDING'`) e `associazioni_in_corso` (stato `'ACCETTATA'`). Attiva il flag 
`nuova_richiesta_pending` se esistono richieste di associazione, voto o 
modifica in sospeso.

---

#### `accettaAssociazione()` / `rifiutaAssociazione()`

**Firma:** `accettaAssociazione(id_associazione: number): Promise<void>` / 
`rifiutaAssociazione(id_associazione: number): Promise<void>`

**Scopo:** gestiscono l'accettazione o il rifiuto di una richiesta di 
associazione ricevuta da un utente.

**Funzionamento:** chiamano il `GestioneUtentiService` per aggiornare lo 
stato dell'associazione tramite `accettaAssociazione` o 
`annullaAssociazione`; in caso di successo, ricaricano l'elenco delle 
associazioni del professionista.

>[!example] Parametri:
>Prendono in input l'id `number` dell'associazione da accettare/rifiutare

---

#### `accettaRichiesta()`

**Firma:** `accettaRichiesta(richiesta: {id: number, id_att: number, tipologia: number, tipo: string}): Promise<void>`

**Scopo:** gestisce l'accettazione di una richiesta di modifica o votazione 
di un pasto/allenamento, reindirizzando il professionista alla pagina 
pertinente.

**Funzionamento:** verifica che `richiesta.tipo` sia `'MODIFICA'` o 
`'VOTO'`; in caso contrario interrompe l'esecuzione. Chiama 
`accettaRichiesta` del `GestioneUtentiService`, e in caso di successo, in 
base a `richiesta.tipologia` (`0` per pasto, `1` per allenamento), 
reindirizza rispettivamente a `/pastiUtente` o `/allenamentiUtente`, 
passando `id_att` e `tipo` come query params.

>[!example] Parametri:
>Prende in input l'oggetto `richiesta` composto dalle proprietà `id: number`, 
>`id_att: number`, `tipologia: number` e `tipo: string`

---

#### `rifiutaRichiesta()`

**Firma:** `rifiutaRichiesta(id_richiesta: number): Promise<void>`

**Scopo:** rifiuta una richiesta di modifica o votazione ricevuta.

**Funzionamento:** chiama `annullaRichiesta` del `GestioneUtentiService`; in 
caso di successo, ricarica l'elenco delle richieste del professionista.

>[!example] Parametri:
>Prende in input l'id `number` della richiesta da rifiutare



---
---


## Bacheca Page

> [!abstract] Descrizione
> Questa pagina mostra un feed condiviso di pasti e allenamenti pubblicati 
> dagli utenti, filtrabile per tipologia. Permette di visualizzare i dettagli 
> di ciascuna attività, votarla, clonarla nel proprio profilo e condividere 
> nuove attività tramite.

### Metodi lifecycle della pagina

#### `ionViewWillLeave()`

**Scopo:** effettua la pulizia delle sottoscrizioni quando la pagina viene 
abbandonata.

**Funzionamento:** emette un valore attraverso `destroy$`, annullando le 
sottoscrizioni RxJS attive tramite `takeUntil`.

---

### Metodi implementati

#### `caricaBacheca()`

**Scopo:** carica e unifica in un unico elenco i pasti e gli allenamenti 
condivisi in bacheca, ordinati per data di condivisione.

**Funzionamento:** svuota gli array `attivita_bacheca` e `attivita_filtrate`, 
quindi tramite `forkJoin` effettua in parallelo le chiamate a 
`getPastiBacheca` e `getAllenamentiBacheca` del `GestioneBachecaService`. 
Arricchisce ciascun elemento con proprietà di stato aggiuntive 
(`tipologia_mostrata`, flag per modalità dettagli/voto, contatori di voto), 
unisce i due elenchi e li ordina in ordine decrescente per data di 
condivisione. Chiama infine `filtraBacheca()` per applicare l'eventuale 
filtro attivo, e `caricaVotiIniziali()` per recuperare i voti di ciascuna 
attività.

---

#### `caricaVotiIniziali()`

**Firma:** `caricaVotiIniziali(): Promise<void>`

**Scopo:** recupera il voto medio di ciascuna attività presente in bacheca.

**Funzionamento:** itera sull'array `attivita_bacheca`, chiamando in sequenza 
`getVotoAttivita()` per ciascun elemento tramite `await` all'interno di un 
ciclo `for...of`.

---

#### `filtraBacheca()`

**Scopo:** applica il filtro di visualizzazione corrente (tutti, pasti, 
allenamenti) all'elenco delle attività.

**Funzionamento:** se il filtro è `"tutti"`, mostra l'intero elenco; 
altrimenti filtra `attivita_bacheca` in base a `tipologia_mostrata`, 
popolando `attivita_filtrate`.

---

#### `cambiaFiltro()`

**Firma:** `cambiaFiltro(event: any)`

**Scopo:** gestisce il cambio di filtro selezionato dall'utente tramite 
`ion-segment`.

**Funzionamento:** aggiorna `filtro` con il valore selezionato e chiama 
`filtraBacheca()` per aggiornare la visualizzazione.

>[!example] Parametri:
>Prende in input l'`event` (di tipo `any`) generato dal cambio di selezione 
>sull'`ion-segment`

---

#### `getDettagliAttivita()`

**Firma:** `getDettagliAttivita(attivita: any): Promise<void>`

**Scopo:** carica (o nasconde, se già visibili) i dettagli di un'attività 
selezionata, distinguendo tra pasto e allenamento.

**Funzionamento:** se i dettagli sono già visibili, li nasconde e interrompe 
l'esecuzione. Altrimenti, in base a `tipologia_attivita` (`0` per pasto, `1` 
per allenamento), recupera i dettagli chiamando `getDettagliPasto` o 
`getDettagliAllenamento` del rispettivo Service, popolando `attivita.dettagli`.

>[!example] Parametri:
>Prende in input l'oggetto `attivita` di cui si vogliono caricare i dettagli

---

#### `alimentoTrack()` / `esercizioTrack()`

**Firma:** `alimentoTrack(index: number, alimento: any): string` / 
`esercizioTrack(index: number, esercizio: any): string`

**Scopo:** funzioni di tracking utilizzate nei cicli `@for` del template, 
per ottimizzare il re-rendering evitando la ricreazione di elementi DOM 
invariati.

**Funzionamento:** restituiscono una stringa identificativa costruita 
concatenando alcune proprietà rilevanti dell'oggetto.

>[!example] Parametri:
>Ricevono in input `index: number`, cioè l'indice del ciclo for, e l'oggetto 
>(`alimento` o `esercizio`) di cui effettuare il tracking
>Restituiscono in output una `string` che sarà il contenuto visualizzato

---

#### `importa_attivita()`

**Firma:** `importa_attivita(attivita: any): Promise<void>`

**Scopo:** clona un'attività condivisa in bacheca nel profilo dell'utente 
corrente.

**Funzionamento:** in base a `tipologia_attivita`, chiama `clonaPasto` o 
`clonaAllenamento` del rispettivo Service per clonare l'attività. In caso di 
successo, mostra un alert di conferma e disabilita ulteriori cloni per la 
stessa attività (`disable_clona = true`).

>[!example] Parametri:
>Prende in input l'oggetto `attivita` da clonare nel proprio profilo

---

#### `getVotoAttivita()`

**Firma:** `getVotoAttivita(attivita: any): Promise<void>`

**Scopo:** calcola la valutazione media di una singola attività a partire 
dai voti ricevuti.

**Funzionamento:** chiama `getVotiAttivita` del `GestioneBachecaService` per 
recuperare i voti, calcolandone media e conteggio totale, salvati 
direttamente sulle proprietà `media` e `voti_totali_attivita` dell'oggetto 
attività passato come parametro.

>[!example] Parametri:
>Prende in input l'oggetto `attivita` di cui calcolare la valutazione media

---

#### `votaAttivita()`

**Firma:** `votaAttivita(attivita: any)`

**Scopo:** attiva o disattiva la modalità di votazione per una specifica 
attività.

**Funzionamento:** se la modalità voto è già attiva per quell'attività, la 
disattiva e interrompe l'esecuzione. Altrimenti, ne ricarica il voto corrente 
tramite `getVotoAttivita()` e attiva `modalita_voto`.

>[!example] Parametri:
>Prende in input l'oggetto `attivita` da votare

---

#### `inviaVoto()`

**Firma:** `inviaVoto(voto: number, attivita: any): Promise<void>`

**Scopo:** invia la valutazione assegnata a un'attività.

**Funzionamento:** costruisce l'oggetto `voto_da_inviare` e lo invia 
chiamando `votaAttivita` del `GestioneBachecaService`. In caso di successo, 
mostra un alert di conferma, disattiva la modalità voto e disabilita 
ulteriori votazioni per la stessa attività (`disable_voto = true`).

>[!example] Parametri:
>Prende in input il `voto` (`number`) assegnato e l'oggetto `attivita` votata

---

#### `condivisione()`

**Firma:** `condivisione(): Promise<void>`

**Scopo:** presenta all'utente un action sheet per scegliere cosa condividere 
in bacheca (un pasto o un allenamento esistente).

**Funzionamento:** crea e mostra un `ion-action-sheet` con due opzioni di 
navigazione (verso `/pastiUtente` o `/allenamentiUtente`, dove l'utente potrà 
selezionare l'attività da condividere) e un'opzione di annullamento.

---
---


<center><h1> Components </h1></center>


## Info Dettagli Component

> [!abstract] Descrizione
> Questo componente mostra le informazioni di dettaglio di un alimento o di 
> un esercizio (in base al flag `foodBool`), permettendo all'utente di 
> specificare quantità/parametri (quantità in grammi per gli alimenti; serie, 
> ripetizioni, riposo e pesi per gli esercizi) prima di aggiungerlo alla 
> lista del pasto o dell'allenamento in fase di creazione.

### Metodi implementati

#### `getImgPath()`

**Firma:** `getImgPath(dettaglio: any): string`

**Scopo:** costruisce il percorso dell'immagine associata al dettaglio 
mostrato (alimento o esercizio).

**Funzionamento:** in base al flag `foodBool`, normalizza il nome 
dell'alimento (`dettaglio.name`) o la fase dell'esercizio (`dettaglio.fase`) 
in minuscolo e con gli spazi sostituiti da underscore, componendo il percorso 
finale nella cartella `assets/dettagli/`.

>[!example] Parametri:
>Prende in input l'oggetto `dettaglio` (alimento o esercizio) di cui 
>costruire il percorso immagine
>Restituisce in output una `string` contenente il percorso dell'immagine

---

#### `mandaInLista()`

**Scopo:** conferma l'inserimento del dettaglio corrente, inviandolo al 
componente padre.

**Funzionamento:** emette tramite `inLista` un oggetto con id, nome e tutti 
i parametri impostati dall'utente (quantità, serie, ripetizioni, riposo, 
pesi), quindi chiama `chiudi()` per chiudere il pannello con l'animazione di 
uscita.

---

#### `chiudi()`

**Scopo:** chiude il pannello dei dettagli con un'animazione di uscita, 
ripristinando lo stato interno del componente.

**Funzionamento:** imposta `isClosing` a `true`, quindi tramite `setTimeout` 
attende 400ms (durata dell'animazione) prima di azzerare `dettaglio` e tutti 
i parametri numerici ai valori di default, e disattivare `isClosing`.

---

#### `ngOnDestroy()`

**Scopo:** ripristina lo stato del componente quando questo viene distrutto.

**Funzionamento:** azzera `dettaglio` e tutti i parametri numerici, 
analogamente a quanto avviene al termine dell'animazione in `chiudi()`, ma 
senza attesa (`setTimeout`), essendo la distruzione del componente immediata.


---
---

## Modifica Dettagli Component

> [!abstract] Descrizione
> Questo componente gestisce la modifica dei dettagli di un'attività già 
> esistente (pasto o allenamento, in base al flag `foodBool`), riutilizzando 
> `RiempiDettagliComponent` e `InfoDettagliComponent` per la selezione e 
> configurazione dei singoli elementi (alimenti o esercizi), in modo analogo 
> al flusso di creazione ma con un livello di indirezione aggiuntivo verso 
> il componente padre.

### Metodi implementati

#### `onDettaglioSelezionato()`

**Firma:** `onDettaglioSelezionato(dettaglio: number)`

**Scopo:** inoltra al componente padre l'id del dettaglio selezionato 
dall'utente all'interno di `RiempiDettagliComponent`.

**Funzionamento:** riceve l'id tramite `@Output` da `RiempiDettagliComponent` 
ed emette lo stesso valore tramite `dettaglio_selezionato_in_attesa`, delegando 
al padre il recupero dei dati completi (che verranno poi ricevuti da questo 
componente tramite l'`@Input` `dettaglio_selezionato`).

>[!example] Parametri:
>Prende in input l'id `number` del dettaglio selezionato

---

#### `onDettagliInseriti()`

**Firma:** `onDettagliInseriti(dettagli: any[])`

**Scopo:** trasforma l'elenco definitivo dei dettagli inseriti/modificati nel 
formato atteso dal backend, prima di inviarlo al padre.

**Funzionamento:** mappa ciascun elemento dell'array ricevuto in un nuovo 
oggetto contenente solo le proprietà pertinenti al tipo di attività (quantità 
per gli alimenti; serie, ripetizioni, pesi e riposo per gli esercizi), 
normalizzando l'id del dettaglio (`dettaglio.id` se presente, altrimenti 
`dettaglio.id_dettaglio`). Emette il risultato tramite `inviaModifiche`, 
quindi chiama `clickChiudi()` per chiudere il componente.

>[!example] Parametri:
>Prende in input l'array `dettagli: any[]` contenente i dettagli inseriti o 
>modificati

---

#### `mettiInLista()`

**Firma:** `mettiInLista(dettaglio: any)`

**Scopo:** riceve un dettaglio selezionato e configurato da 
`InfoDettagliComponent`, per inviarlo a `RiempiDettagliComponent`.

**Funzionamento:** salva il dettaglio ricevuto in `dettaglio_da_aggiungere`.

>[!example] Parametri:
>Prende in input l'oggetto `dettaglio` selezionato e configurato

---

#### `clickChiudi()`

**Scopo:** chiude il componente di modifica con un'animazione di uscita, 
ripristinando lo stato interno.

**Funzionamento:** svuota `dettagli_attivita_da_modificare` e azzera 
`dettaglio_selezionato`, imposta `isClosing` a `true` per attivare la 
transizione CSS, quindi tramite `setTimeout` (400ms) emette l'evento `chiudi` 
e disattiva `isClosing`.


---
---

## Calendario Component

> [!abstract] Descrizione
> Questo componente visualizza un calendario mensile (tramite la libreria 
> FullCalendar) con gli eventi di pasti e allenamenti programmati dall'utente. 
> Cliccando su un giorno, mostra le attività già presenti in quella data e 
> permette di aggiungerne di nuove, selezionandole tra i pasti e gli 
> allenamenti già creati.


---

### Metodi implementati

#### `ngOnInit()`

**Scopo:** inizializza il componente al primo caricamento.

**Funzionamento:** invoca `loadAllEvents()` per popolare il calendario con 
gli eventi esistenti, e registra l'icona `arrowBack` tramite `addIcons()`.

---

#### `handleDateClick()`

**Firma:** `handleDateClick(dateStr: string): void`

**Scopo:** gestisce il click su un giorno del calendario, mostrando le 
attività programmate per quella data.

**Funzionamento:** salva la data selezionata, apre il modal di dettaglio 
(`isShow = true`), disattiva l'eventuale modalità di aggiunta attività 
precedentemente attiva, e invoca `loadAttivitaGiornaliere()` per filtrare 
gli eventi del giorno.

---

#### `loadAttivitaGiornaliere()`

**Scopo:** filtra, tra tutti gli eventi già caricati, quelli relativi alla 
data selezionata, separandoli per tipologia.

**Funzionamento:** filtra `attivita_calendario` in base alla data corrispondente 
a `data_selezionata`, quindi suddivide il risultato in `pasti_giornalieri` e 
`allenamenti_giornalieri` in base alla proprietà `extendedProps.tipo` di 
ciascun evento.

---

#### `aggiungiAttivita()`

**Scopo:** prepara la visualizzazione della lista di pasti e allenamenti 
già esistenti, da cui l'utente può scegliere quale programmare nella data 
selezionata.

**Funzionamento:** tramite `forkJoin`, effettua in parallelo le richieste per 
ottenere tutti i pasti e allenamenti dell'utente, popolando `pasti_utente` e 
`allenamenti_utente`. Attiva quindi la modalità di aggiunta (`aggiuntaAttivita = true`).

---

#### `fissaPasto()`

**Firma:** `fissaPasto(id_attivita: number): Promise<void>`

**Scopo:** programma un pasto esistente nella data selezionata.

**Funzionamento:** chiama il `GestionePastiService` per associare il 
pasto alla data corrente. In caso di successo, disattiva la modalità di 
aggiunta. Ricarica sempre gli eventi del calendario al termine, 
indipendentemente dall'esito.

---

#### `disdiciPasto()`

**Firma:** `disdiciPasto(id_pasto: number): Promise<void>`

**Scopo:** rimuove la programmazione di un pasto dalla data selezionata.

**Funzionamento:** chiama il `GestionePastiService`; in caso di successo, 
ricarica gli eventi del calendario tramite `loadAllEvents()`.

---

#### `fissaAllenamento()`

**Firma:** `fissaAllenamento(id_allenamento: number): Promise<void>`

**Scopo:** programma un allenamento esistente nella data selezionata, 
verificando preventivamente che non esista già un allenamento nello stesso 
giorno.

**Funzionamento:**
1. In un primo blocco `try/catch`, verifica tramite `checkAllenamento` se 
   esiste già un allenamento nella data selezionata; in caso affermativo, 
   mostra un alert informativo e interrompe l'esecuzione
2. Se non esiste, in un secondo blocco `try/catch` procede alla programmazione 
   tramite `programmaAllenamento`. In caso di successo, disattiva la modalità 
   di aggiunta e ricarica gli eventi.

---

#### `eliminaAllenamento()`

**Firma:** `eliminaAllenamento(id_allenamento: number): Promise<void>`

**Scopo:** elimina un allenamento direttamente dalla vista calendario.

**Funzionamento:** chiama il `GestioneAllenamentiService`; in caso di 
successo, chiude il modal di dettaglio (`isShow = false`) e ricarica gli 
eventi del calendario.

---

#### `chiudiModal()`

**Scopo:** chiude il modal di dettaglio/aggiunta attività, ripristinando lo 
stato del componente.

**Funzionamento:** ricarica gli eventi del calendario, svuota gli array di 
pasti/allenamenti giornalieri e disponibili, e disattiva entrambi i flag di 
visualizzazione (`isShow`, `aggiuntaAttivita`).

---

#### `loadAllEvents()`

**Scopo:** carica tutti i pasti programmati e gli allenamenti dell'utente, 
trasformandoli in eventi compatibili con FullCalendar.

**Funzionamento:**
1. Tramite `forkJoin`, richiede in parallelo i pasti programmati e gli 
   allenamenti dell'utente, filtrando questi ultimi per escludere quelli privi 
   di data (`map`)
2. Costruisce un array unico di eventi (`tutte_le_attivita`), assegnando a 
   ciascuno un'icona, un colore distintivo e i dati originali nella proprietà `extendedProps`, utile per risalire all'oggetto completo al momento del click
3. Per gli allenamenti, converte la data da oggetto `Date` al formato 
   `YYYY-MM-DD` richiesto da FullCalendar, componendolo manualmente da anno, 
   mese e giorno
4. Aggiorna sia `calendarOptions.events` sia, se il riferimento al componente 
   calendario è disponibile, la sorgente eventi tramite l'API nativa di 
   FullCalendar (`removeAllEvents()` + `addEventSource()`)
5. Richiama infine `loadAttivitaGiornaliere()`, per mantenere coerente anche 
   la visualizzazione del giorno eventualmente già selezionato


---
---

## Richieste Utente Component

> [!abstract] Descrizione
> Questo componente visualizza l'elenco delle richieste (di modifica o voto) 
> ricevute da un professionista, permettendo di accettarle o rifiutarle 
> direttamente dall'interfaccia.

### Metodi implementati

#### `accettaRichiesta()`

**Firma:** `accettaRichiesta(id_richiesta: number, id_attivita: number, tipologia_attivita: number, tipo_richiesta: string)`

**Scopo:** gestisce l'accettazione di una richiesta da parte dell'utente, 
inoltrandola al componente padre.

**Funzionamento:** costruisce l'oggetto `richiesta` a partire dai parametri 
ricevuti, quindi lo emette tramite l'evento `accetta`, delegando al padre 
(`RichiestePage`) la gestione effettiva della chiamata al backend.

>[!example] Parametri:
>Prende in input l'id `number` della richiesta, l'id `number` dell'attività 
>correlata, la `tipologia_attivita` (`number`, pasto o allenamento) e il 
>`tipo_richiesta` (`string`, modifica o voto)

---

#### `rifiutaRichiesta()`

**Firma:** `rifiutaRichiesta(id_richiesta: number)`

**Scopo:** gestisce il rifiuto di una richiesta da parte dell'utente, 
inoltrandolo al componente padre.

**Funzionamento:** emette l'id della richiesta tramite l'evento `rifiuta`.

>[!example] Parametri:
>Prende in input l'id `number` della richiesta da rifiutare



---
---


## Utenti Associati Component

> [!abstract] Descrizione
> Questo componente visualizza l'elenco degli utenti associati (professionisti 
> o clienti, in base al flag `flag_utenti`), permettendo di richiederne 
> l'annullamento dell'associazione direttamente dall'interfaccia.

### Metodi implementati

#### `richiediAnnullamento()`

**Firma:** `richiediAnnullamento(id_associazione: number)`

**Scopo:** gestisce la richiesta di annullamento di un'associazione da parte 
dell'utente, inoltrandola al componente padre.

**Funzionamento:** emette l'id dell'associazione tramite l'evento 
`cancella_associazione`, delegando al padre la gestione effettiva della 
chiamata al backend.


>[!example] Parametri:
>Prende in input l'id `number` dell'associazione da annullare.



---
---

## Vota Attivita Component

> [!abstract] Descrizione
> Questo componente implementa un sistema di valutazione a stelle, da 0 a 5, 
> con incrementi di mezza stella, utilizzato per votare pasti e allenamenti 
> condivisi in bacheca. Può funzionare sia in modalità "votazione attiva" 
> (`devo_votare = true`) sia in modalità "sola visualizzazione" di un voto 
> già espresso in precedenza.

### Metodi implementati

#### `selezionaStella()`

**Firma:** `selezionaStella(index: number)`

**Scopo:** gestisce il click dell'utente sulle icone a forma di stella, aggiornando il voto 
corrente con incrementi di mezza stella.

**Funzionamento:** confronta `voto_attuale` con l'indice della stella cliccata 
per determinare il nuovo stato:
- se il voto attuale corrisponde già a mezza stella su quell'indice 
  (`index - 0.5`), lo completa alla stella intera (`index`)
- se il voto attuale corrisponde già alla stella piena (`index`), lo riporta 
  alla stella precedente (`index - 1`)
- altrimenti, imposta il voto a mezza stella (`index - 0.5`)

Questo ciclo a tre stati (vuota → mezza → piena → vuota) permette all'utente 
di selezionare valutazioni con precisione di 0.5 cliccando ripetutamente 
sulla stessa stella.


>[!example] Parametri:
>Prende in input l'indice `number` delle stelle da inserire nel ciclo `@for`

---

#### `getIconaStella()`

**Firma:** `getIconaStella(index: number): string`

**Scopo:** determina quale icona mostrare per ciascuna delle cinque stelle, 
in base al voto corrente (o al voto precedente, in modalità sola 
visualizzazione).

**Funzionamento:** in base al flag `devo_votare`, confronta l'indice della 
stella con `voto_attuale` oppure con `voto_precedente`, restituendo 
rispettivamente `'star'` (piena), `'star-half-outline'` (mezza) o 
`'star-outline'` (vuota).

>[!example] Parametri:
>Prende in input l'indice `number` delle stelle da inserire nel ciclo `@for` all'interno della condizione `@if` oppure nelle istruzioni della condizione `@else`
>Restituisce in output una `string` contenente il nome dell'icona da far visualizzare dinamicamente all'utente in base al voto inserito 

---

#### `confermaVoto()`

**Scopo:** conferma il voto selezionato dall'utente, inoltrandolo al 
componente padre.

**Funzionamento:** emette `voto_attuale` tramite l'evento `voto_inviato`.

---
---

<center><h1> Services </h1></center>

## Login Service

> [!abstract] Descrizione
> Questo servizio, nonostante il nome, gestisce l'intero ciclo di 
> autenticazione dell'applicazione: login, registrazione, logout e recupero 
> del ruolo dell'utente corrente, reso disponibile a tutta l'app tramite un 
> `BehaviorSubject`.

### Metodi implementati

#### `inizializzaRuoloUtente()`

**Scopo:** inizializza `ruoloUtente` leggendo il valore persistito nel 
`localStorage`, così che lo stato di autenticazione sopravviva al refresh 
della pagina.

**Funzionamento:** legge `tipoUtente` dal `localStorage` e lo emette tramite 
`ruoloUtente.next()`.

---

#### `login()`

**Firma:** `login(email: string, password: string): Observable<any>`

**Scopo:** effettua la richiesta di autenticazione al backend.

**Funzionamento:** esegue una richiesta HTTP POST verso l'endpoint 
`/api/auth/login`, restituendo l'`Observable` non ancora sottoscritto (la 
sottoscrizione avviene nel componente chiamante, tramite `firstValueFrom`).

>[!example] Parametri:
>Prende in input `email` e `password`, entrambi di tipo `string`
>Restituisce in output un `Observable<any>` contenente la risposta del 
>backend (token e messaggio di conferma)

---

#### `onLoginSuccess()`

**Firma:** `onLoginSuccess(ruolo: string | number): Promise<void>`

**Scopo:** completa il flusso di login, salvando il ruolo dell'utente e 
reindirizzandolo alla Home Page.

**Funzionamento:** converte il ruolo ricevuto in stringa, lo salva nel 
`localStorage` e lo emette tramite `ruoloUtente.next()`, quindi naviga verso 
`/home`.

>[!example] Parametri:
>Prende in input il `ruolo` (`string | number`) dell'utente appena autenticato

---

#### `getUserRole()`

**Firma:** `getUserRole(): Observable<string | null>`

**Scopo:** espone `ruoloUtente` come `Observable` di sola lettura, per i 
componenti che necessitano solo di sottoscriversi senza accedere direttamente 
al `BehaviorSubject`.

**Funzionamento:** restituisce `ruoloUtente.asObservable()`.

>[!example] Parametri:
>Restituisce in output un `Observable<string | null>` che emette il ruolo 
>corrente dell'utente ad ogni cambiamento

---

#### `getRuoliProfessionista()`

**Firma:** `getRuoliProfessionista(): Observable<any[]>`

**Scopo:** recupera l'elenco delle specializzazioni professionali disponibili, 
utilizzato nella `RegistrazionePage`.

**Funzionamento:** esegue una richiesta HTTP GET verso l'endpoint 
`/api/auth/ruoliProfessionista`.

>[!example] Parametri:
>Restituisce in output un `Observable<any[]>` contenente l'elenco delle 
>specializzazioni professionali disponibili

---

#### `getUserId()`

**Firma:** `getUserId(): number`

**Scopo:** recupera in modo sincrono l'id dell'utente corrente, decodificando 
il token JWT salvato.

**Funzionamento:** legge il token dal `localStorage`; se assente, restituisce 
`0`. Altrimenti, lo decodifica tramite `jwt-decode` ed estrae la proprietà 
`id` dal payload.

>[!example] Parametri:
>Restituisce in output un `number` corrispondente all'id dell'utente 
>corrente, oppure `0` se non è presente alcun token

---

#### `register()`

**Firma:** `register(ruolo: string, id_ruolo_professionista: number | null, nome: string, cognome: string, email: string, password: string): Observable<any>`

**Scopo:** effettua la richiesta di registrazione di un nuovo account al 
backend.

**Funzionamento:** esegue una richiesta HTTP POST verso l'endpoint 
`/api/auth/register`, richiedendo esplicitamente l'intera risposta HTTP 
(`observe: 'response'`) anziché il solo corpo.

>[!example] Parametri:
>Prende in input `ruolo` (`string`), `id_ruolo_professionista` (`number | null`), 
>`nome`, `cognome`, `email` e `password` (tutti `string`)
>Restituisce in output un `Observable<any>` contenente l'intera risposta 
>HTTP della registrazione

---

#### `onRegistrationSuccess()`

**Firma:** `onRegistrationSuccess(): Promise<void>`

**Scopo:** completa il flusso di registrazione, reindirizzando l'utente alla 
pagina di login.

**Funzionamento:** naviga verso `/login`.

---

#### `onLogoutSuccess()`

**Firma:** `onLogoutSuccess(): Promise<void>`

**Scopo:** gestisce il logout dell'utente, ripulendo lo stato di autenticazione.

**Funzionamento:** rimuove `tipoUtente`, `userEmail` e `token` dal 
`localStorage`, azzera `ruoloUtente` tramite `.next(null)`, quindi naviga 
verso `/login`.



---
---

## Gestione Pasti Service

> [!abstract] Descrizione
> Questo servizio centralizza tutte le chiamate HTTP relative alla gestione 
> dei pasti: creazione, riempimento con alimenti, modifica, programmazione 
> nel calendario, clonazione, eliminazione e recupero dati (pasti dell'utente, 
> dettagli, alimenti disponibili).

### Metodi implementati

#### `creaPasti()`

**Firma:** `creaPasti(nome: string, tipo: string, data_creazione: string)`

**Scopo:** crea un nuovo pasto nel database.

**Funzionamento:** esegue una richiesta HTTP POST verso 
`/api/pasti/creaPasti`, allegando il token di autenticazione nell'header 
`Authorization` e richiedendo l'intera risposta HTTP (`observe: 'response'`).

>[!example] Parametri:
>Prende in input `nome`, `tipo` e `data_creazione`, tutti di tipo `string`
>Restituisce in output un `Observable<any>` contenente l'intera risposta 
>HTTP della creazione

---

#### `riempiPasto()`

**Firma:** `riempiPasto(id_pasto: number, alimenti: any[])`

**Scopo:** associa a un pasto già creato l'elenco definitivo degli alimenti 
che lo compongono.

**Funzionamento:** esegue una richiesta HTTP POST verso 
`/api/pasti/riempiPasto`.

>[!example] Parametri:
>Prende in input l'id `number` del pasto e l'array `alimenti: any[]` da 
>associarvi
>Restituisce in output un `Observable<any>` contenente l'intera risposta HTTP

---

#### `modificaPasto()`

**Firma:** `modificaPasto(id_pasto: number, modifiche_pasto: any[])`

**Scopo:** invia al backend le modifiche apportate agli alimenti di un pasto 
esistente.

**Funzionamento:** esegue una richiesta HTTP POST verso 
`/api/pasti/modificaPasto`.

>[!example] Parametri:
>Prende in input l'id `number` del pasto e l'array `modifiche_pasto: any[]` 
>da applicare
>Restituisce in output un `Observable<any>` contenente l'intera risposta HTTP

---

#### `programmaPasto()`

**Firma:** `programmaPasto(id_pasto: number, data_calendario: string)`

**Scopo:** programma un pasto esistente in una specifica data del calendario.

**Funzionamento:** esegue una richiesta HTTP POST verso 
`/api/pasti/programmaPasto`.

>[!example] Parametri:
>Prende in input l'id `number` del pasto e la `data_calendario` (`string`) 
>in cui programmarlo
>Restituisce in output un `Observable<any>` contenente l'intera risposta HTTP

---

#### `clonaPasto()`

**Firma:** `clonaPasto(id_pasto: number)`

**Scopo:** duplica un pasto condiviso in bacheca nel profilo dell'utente 
corrente.

**Funzionamento:** esegue una richiesta HTTP POST verso 
`/api/pasti/clonaPasto`.

>[!example] Parametri:
>Prende in input l'id `number` del pasto da clonare
>Restituisce in output un `Observable<any>` contenente l'intera risposta HTTP

---

#### `disdiciPasto()`

**Firma:** `disdiciPasto(id_pasto: number, data_calendario: string)`

**Scopo:** rimuove la programmazione di un pasto da una specifica data del 
calendario, senza eliminarlo definitivamente.

**Funzionamento:** esegue una richiesta HTTP DELETE verso 
`/api/pasti/disdiciPasto`, passando i parametri nel corpo della richiesta 
(`body`).

>[!example] Parametri:
>Prende in input l'id `number` del pasto e la `data_calendario` (`string`) 
>da cui rimuovere la programmazione
>Restituisce in output un `Observable<any>` contenente l'intera risposta HTTP

---

#### `eliminaPasto()`

**Firma:** `eliminaPasto(id_pasto: number)`

**Scopo:** elimina definitivamente un pasto dal database.

**Funzionamento:** esegue una richiesta HTTP DELETE verso 
`/api/pasti/eliminaPasto/{id_pasto}`, passando l'id direttamente nell'URL.

>[!example] Parametri:
>Prende in input l'id `number` del pasto da eliminare
>Restituisce in output un `Observable<any>` contenente l'intera risposta HTTP

---

#### `checkPasto()`

**Firma:** `checkPasto(nome: String, tipo: string)`

**Scopo:** verifica se esiste già un pasto con lo stesso nome e tipo, prima 
di procedere alla creazione.

**Funzionamento:** esegue una richiesta HTTP POST verso 
`/api/pasti/checkPasto`.

>[!example] Parametri:
>Prende in input `nome` (`String`) e `tipo` (`string`) del pasto da verificare
>Restituisce in output un `Observable<any>` contenente l'esito della verifica

---

#### `getPastiUtente()`

**Firma:** `getPastiUtente(): Observable<Pasto[]>`

**Scopo:** recupera l'elenco completo dei pasti associati all'utente corrente.

**Funzionamento:** esegue una richiesta HTTP GET verso `/api/pasti/pastiUtente`.

>[!example] Parametri:
>Restituisce in output un `Observable<Pasto[]>` contenente l'elenco dei 
>pasti dell'utente

---

#### `getPastiProgrammati()`

**Firma:** `getPastiProgrammati(): Observable<Pasto[]>`

**Scopo:** recupera l'elenco dei pasti già programmati nel calendario.

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/pasti/pastiProgrammati`.

>[!example] Parametri:
>Restituisce in output un `Observable<Pasto[]>` contenente l'elenco dei 
>pasti programmati

---

#### `getDettagliPasto()`

**Firma:** `getDettagliPasto(id_pasto: number): Observable<any>`

**Scopo:** recupera gli alimenti e i valori nutrizionali associati a un 
singolo pasto.

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/pasti/dettagliPasto/{id_pasto}`.

>[!example] Parametri:
>Prende in input l'id `number` del pasto di cui recuperare i dettagli
>Restituisce in output un `Observable<any>` contenente i dettagli 
>nutrizionali del pasto

---

#### `getPastoById()`

**Firma:** `getPastoById(id_pasto: number): Observable<any>`

**Scopo:** recupera i dati di un singolo pasto a partire dal suo id, 
utilizzato dal professionista per accedere a un pasto specifico.

**Funzionamento:** esegue una richiesta HTTP GET verso `/api/pasti/pasto/{id_pasto}`.

>[!example] Parametri:
>Prende in input l'id `number` del pasto da recuperare
>Restituisce in output un `Observable<any>` contenente i dati del pasto

---

#### `getAlimenti()`

**Firma:** `getAlimenti()`

**Scopo:** recupera l'elenco completo degli alimenti disponibili nel database.

**Funzionamento:** esegue una richiesta HTTP GET verso `/api/pasti/alimenti`.

>[!example] Parametri:
>Restituisce in output un `Observable<any[]>` contenente l'elenco degli 
>alimenti disponibili

---

#### `getAlimentoById()`

**Firma:** `getAlimentoById(id_alimento: number): Observable<any>`

**Scopo:** recupera i dati completi di un singolo alimento a partire dal suo 
id.

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/pasti/alimento/{id_alimento}`.

>[!example] Parametri:
>Prende in input l'id `number` dell'alimento da recuperare
>Restituisce in output un `Observable<any>` contenente i dati dell'alimento



---
---

## Gestione Allenamenti Service

> [!abstract] Descrizione
> Questo servizio centralizza tutte le chiamate HTTP relative alla gestione 
> degli allenamenti: creazione, riempimento con esercizi, modifica, 
> programmazione nel calendario, clonazione, eliminazione e recupero dati 
> (allenamenti dell'utente, dettagli, esercizi disponibili).

### Metodi implementati

#### `creaAllenamenti()`

**Firma:** `creaAllenamenti(nome: string, giorno: string, durata: number, data_creazione: string)`

**Scopo:** crea un nuovo allenamento nel database.

**Funzionamento:** esegue una richiesta HTTP POST verso 
`/api/allenamenti/creaAllenamenti`, allegando il token di autenticazione 
nell'header `Authorization` e richiedendo l'intera risposta HTTP 
(`observe: 'response'`).

>[!example] Parametri:
>Prende in input `nome` (`string`), `giorno` (`string`), `durata` (`number`) 
>e `data_creazione` (`string`)
>Restituisce in output un `Observable<any>` contenente l'intera risposta HTTP

---

#### `riempiAllenamento()`

**Firma:** `riempiAllenamento(id_allenamento: number, esercizi: any[])`

**Scopo:** associa a un allenamento già creato l'elenco definitivo degli 
esercizi che lo compongono.

**Funzionamento:** esegue una richiesta HTTP POST verso 
`/api/allenamenti/riempiAllenamento`.

>[!example] Parametri:
>Prende in input l'id `number` dell'allenamento e l'array `esercizi: any[]` 
>da associarvi
>Restituisce in output un `Observable<any>` contenente l'intera risposta HTTP

---

#### `modificaAllenamento()`

**Firma:** `modificaAllenamento(id_allenamento: number, modifiche_allenamento: any[])`

**Scopo:** invia al backend le modifiche apportate agli esercizi di un 
allenamento esistente.

**Funzionamento:** esegue una richiesta HTTP POST verso 
`/api/allenamenti/modificaAllenamento`.

>[!example] Parametri:
>Prende in input l'id `number` dell'allenamento e l'array 
>`modifiche_allenamento: any[]` da applicare
>Restituisce in output un `Observable<any>` contenente l'intera risposta HTTP

---

#### `programmaAllenamento()`

**Firma:** `programmaAllenamento(id_allenamento: number, data_calendario: string)`

**Scopo:** programma un allenamento esistente in una specifica data del 
calendario.

**Funzionamento:** esegue una richiesta HTTP POST verso 
`/api/allenamenti/programmaAllenamento`.

>[!example] Parametri:
>Prende in input l'id `number` dell'allenamento e la `data_calendario` 
>(`string`) in cui programmarlo
>Restituisce in output un `Observable<any>` contenente l'intera risposta HTTP

---

#### `clonaAllenamento()`

**Firma:** `clonaAllenamento(id_allenamento: number)`

**Scopo:** duplica un allenamento condiviso in bacheca nel profilo 
dell'utente corrente.

**Funzionamento:** esegue una richiesta HTTP POST verso 
`/api/allenamenti/clonaAllenamento`.

>[!example] Parametri:
>Prende in input l'id `number` dell'allenamento da clonare
>Restituisce in output un `Observable<any>` contenente l'intera risposta HTTP

---

#### `eliminaAllenamento()`

**Firma:** `eliminaAllenamento(id_allenamento: number)`

**Scopo:** elimina definitivamente un allenamento dal database.

**Funzionamento:** esegue una richiesta HTTP DELETE verso 
`/api/allenamenti/eliminaAllenamento/{id_allenamento}`, passando l'id 
direttamente nell'URL.

>[!example] Parametri:
>Prende in input l'id `number` dell'allenamento da eliminare
>Restituisce in output un `Observable<any>` contenente l'intera risposta HTTP

---

#### `checkAllenamento()`

**Firma:** `checkAllenamento(giorno: string)`

**Scopo:** verifica se esiste già un allenamento programmato per un 
determinato giorno, prima di procedere alla creazione.

**Funzionamento:** esegue una richiesta HTTP POST verso 
`/api/allenamenti/checkAllenamento`.

>[!example] Parametri:
>Prende in input il `giorno` (`string`) da verificare
>Restituisce in output un `Observable<any>` contenente l'esito della verifica

---

#### `getAllenamentiUtente()`

**Firma:** `getAllenamentiUtente(): Observable<Allenamento[]>`

**Scopo:** recupera l'elenco completo degli allenamenti associati all'utente 
corrente.

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/allenamenti/allenamentiUtente`.

>[!example] Parametri:
>Restituisce in output un `Observable<Allenamento[]>` contenente l'elenco 
>degli allenamenti dell'utente

---

#### `getDettagliAllenamento()`

**Firma:** `getDettagliAllenamento(id_allenamento: number): Observable<any>`

**Scopo:** recupera gli esercizi associati a un singolo allenamento.

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/allenamenti/dettagliAllenamento/{id_allenamento}`.

>[!example] Parametri:
>Prende in input l'id `number` dell'allenamento di cui recuperare i dettagli
>Restituisce in output un `Observable<any>` contenente gli esercizi 
>dell'allenamento

---

#### `getAllenamentoById()`

**Firma:** `getAllenamentoById(id_allenamento: number): Observable<any>`

**Scopo:** recupera i dati di un singolo allenamento a partire dal suo id, 
utilizzato dal professionista per accedere a un allenamento specifico.

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/allenamenti/allenamento/{id_allenamento}`.

>[!example] Parametri:
>Prende in input l'id `number` dell'allenamento da recuperare
>Restituisce in output un `Observable<any>` contenente i dati dell'allenamento

---

#### `getEsercizi()`

**Firma:** `getEsercizi()`

**Scopo:** recupera l'elenco completo degli esercizi disponibili nel database.

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/allenamenti/esercizi`.

>[!example] Parametri:
>Restituisce in output un `Observable<any[]>` contenente l'elenco degli 
>esercizi disponibili

---

#### `getEsercizioById()`

**Firma:** `getEsercizioById(id_esercizio: number): Observable<any>`

**Scopo:** recupera i dati completi di un singolo esercizio a partire dal 
suo id.

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/allenamenti/esercizio/{id_esercizio}`.

>[!example] Parametri:
>Prende in input l'id `number` dell'esercizio da recuperare
>Restituisce in output un `Observable<any>` contenente i dati dell'esercizio



---
---

## Gestione Utenti Service

> [!abstract] Descrizione
> Questo servizio centralizza tutte le chiamate HTTP relative alla gestione 
> degli utenti: dati anagrafici e informazioni fisiche, password, 
> associazioni tra utenti e professionisti, e richieste di modifica/voto.

### Metodi implementati

#### `aggiornaPassword()`

**Firma:** `aggiornaPassword(id_utente: number, vecchiaPassword: string, nuovaPassword: string)`

**Scopo:** aggiorna la password dell'utente.

**Funzionamento:** esegue una richiesta HTTP POST verso 
`/api/users/utente/aggiornaPassword/{id_utente}`.

>[!example] Parametri:
>Prende in input l'id `number` dell'utente, `vecchiaPassword` e 
>`nuovaPassword` (entrambe `string`)
>Restituisce in output un `Observable<any>` contenente l'intera risposta HTTP

---

#### `riempiInfo()`

**Firma:** `riempiInfo(info: any)`

**Scopo:** aggiorna le informazioni fisiche dell'utente (età, peso, altezza, 
condizioni mediche).

**Funzionamento:** esegue una richiesta HTTP POST verso 
`/api/users/utente/riempiInfo`.

>[!example] Parametri:
>Prende in input l'oggetto `info` (`any`) con i dati fisici aggiornati
>Restituisce in output un `Observable<any>` contenente l'intera risposta HTTP

---

#### `getUtenteById()`

**Firma:** `getUtenteById(id_utente: number): Observable<any>`

**Scopo:** recupera i dati anagrafici di un utente a partire dal suo id.

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/users/utente/{id_utente}`.

>[!example] Parametri:
>Prende in input l'id `number` dell'utente da recuperare
>Restituisce in output un `Observable<any>` contenente i dati anagrafici 
>dell'utente

---

#### `getInfoUtenteById()`

**Firma:** `getInfoUtenteById(id_utente: number): Observable<any>`

**Scopo:** recupera le informazioni fisiche di un utente a partire dal suo id.

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/users/infoUtente/{id_utente}`.

>[!example] Parametri:
>Prende in input l'id `number` dell'utente di cui recuperare le informazioni 
>fisiche
>Restituisce in output un `Observable<any>` contenente le informazioni 
>fisiche dell'utente

---

#### `getUtentiByRuolo()`

**Firma:** `getUtentiByRuolo(ruolo: number)`

**Scopo:** recupera l'elenco degli utenti che ricoprono un determinato ruolo, 
usato per mostrare i professionisti disponibili.

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/users/ruoli/{ruolo}`.

>[!example] Parametri:
>Prende in input il `ruolo` (`number`) di cui recuperare gli utenti
>Restituisce in output un `Observable<any[]>` contenente l'elenco degli 
>utenti con quel ruolo

---

#### `getRuoloProfessionista()`

**Firma:** `getRuoloProfessionista(id_professionista: number): Observable<any>`

**Scopo:** recupera il ruolo/specializzazione di un professionista a partire 
dal suo id.

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/users/ruoloProfessionista/{id_professionista}`.

>[!example] Parametri:
>Prende in input l'id `number` del professionista di cui recuperare il ruolo
>Restituisce in output un `Observable<any>` contenente il ruolo del 
>professionista

---

#### `getAssociazioniUtente()`

**Firma:** `getAssociazioniUtente(): Observable<any[]>`

**Scopo:** recupera le associazioni tra l'utente corrente e i professionisti.

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/users/associazioniUtente`.

>[!example] Parametri:
>Restituisce in output un `Observable<any[]>` contenente le associazioni 
>dell'utente

---

#### `getAssociazioniProfessionista()`

**Firma:** `getAssociazioniProfessionista(): Observable<any[]>`

**Scopo:** recupera le associazioni tra il professionista corrente e i propri 
clienti.

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/users/associazioniProfessionista`.

>[!example] Parametri:
>Restituisce in output un `Observable<any[]>` contenente le associazioni 
>del professionista

---

#### `getRichiesteUtente()`

**Firma:** `getRichiesteUtente(): Observable<any[]>`

**Scopo:** recupera le richieste di associazione inviate dall'utente.

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/users/richiesteUtente`.

>[!example] Parametri:
>Restituisce in output un `Observable<any[]>` contenente le richieste 
>inviate dall'utente

---

#### `getRichiesteProfessionista()`

**Firma:** `getRichiesteProfessionista(): Observable<any[]>`

**Scopo:** recupera le richieste di modifica/voto ricevute dal professionista.

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/users/richiesteProfessionista`.

>[!example] Parametri:
>Restituisce in output un `Observable<any[]>` contenente le richieste 
>ricevute dal professionista

---

#### `getAssociazioniPending()`

**Firma:** `getAssociazioniPending(): Observable<any[]>`

**Scopo:** recupera le associazioni in attesa di approvazione da parte del 
professionista.

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/users/associazioniPending`.

>[!example] Parametri:
>Restituisce in output un `Observable<any[]>` contenente le associazioni 
>in attesa

---

#### `getRichiestePending()`

**Firma:** `getRichiestePending(): Observable<any[]>`

**Scopo:** recupera le richieste di modifica/voto in attesa di approvazione.

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/users/richiestePending`.

>[!example] Parametri:
>Restituisce in output un `Observable<any[]>` contenente le richieste in 
>attesa

---

#### `getFeedAssociati()`

**Firma:** `getFeedAssociati(): Observable<any[]>`

**Scopo:** recupera il feed delle attività recenti tracciate dai clienti 
associati al professionista.

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/users/feedAssociati`.

>[!example] Parametri:
>Restituisce in output un `Observable<any[]>` contenente il feed delle 
>attività recenti

---

#### `creaAssociazione()`

**Firma:** `creaAssociazione(id_persona: number): Observable<any>`

**Scopo:** invia una richiesta di associazione a un professionista.

**Funzionamento:** esegue una richiesta HTTP POST verso 
`/api/users/creaAssociazione`.

>[!example] Parametri:
>Prende in input l'id `number` della persona a cui inviare l'associazione
>Restituisce in output un `Observable<any>` contenente l'intera risposta HTTP

---

#### `creaRichiesta()`

**Firma:** `creaRichiesta(dati: any): Observable<any>`

**Scopo:** invia una richiesta di modifica o votazione relativa a un pasto 
o allenamento.

**Funzionamento:** esegue una richiesta HTTP POST verso 
`/api/users/creaRichiesta`.

>[!example] Parametri:
>Prende in input l'oggetto `dati` (`any`) con i dettagli della richiesta
>Restituisce in output un `Observable<any>` contenente l'intera risposta HTTP

---

#### `accettaAssociazione()`

**Firma:** `accettaAssociazione(id_associazione: number): Observable<any>`

**Scopo:** accetta una richiesta di associazione ricevuta.

**Funzionamento:** esegue una richiesta HTTP PATCH verso 
`/api/users/accettaAssociazione`.

>[!example] Parametri:
>Prende in input l'id `number` dell'associazione da accettare
>Restituisce in output un `Observable<any>` contenente l'intera risposta HTTP

---

#### `accettaRichiesta()`

**Firma:** `accettaRichiesta(richiesta: {id: number, id_att: number, tipologia: number, tipo: string}): Observable<any>`

**Scopo:** accetta una richiesta di modifica o votazione ricevuta.

**Funzionamento:** esegue una richiesta HTTP PATCH verso 
`/api/users/accettaRichiesta`.

>[!example] Parametri:
>Prende in input l'oggetto `richiesta` composto da `id`, `id_att`, 
>`tipologia` (tutti `number`) e `tipo` (`string`)
>Restituisce in output un `Observable<any>` contenente l'intera risposta HTTP

---

#### `annullaAssociazione()`

**Firma:** `annullaAssociazione(id_associazione: number): Observable<any>`

**Scopo:** annulla un'associazione esistente o una richiesta pending.

**Funzionamento:** esegue una richiesta HTTP DELETE verso 
`/api/users/annullaAssociazione/{id_associazione}`.

>[!example] Parametri:
>Prende in input l'id `number` dell'associazione da annullare
>Restituisce in output un `Observable<any>` contenente l'intera risposta HTTP

---

#### `annullaRichiesta()`

**Firma:** `annullaRichiesta(id_richiesta: number): Observable<any>`

**Scopo:** rifiuta/annulla una richiesta di modifica o votazione.

**Funzionamento:** esegue una richiesta HTTP DELETE verso 
`/api/users/annullaRichiesta/{id_richiesta}`.

>[!example] Parametri:
>Prende in input l'id `number` della richiesta da annullare
>Restituisce in output un `Observable<any>` contenente l'intera risposta HTTP


---
---

## Gestione Bacheca Service

> [!abstract] Descrizione
> Questo servizio centralizza tutte le chiamate HTTP relative alla bacheca 
> condivisa: recupero delle attività condivise (pasti e allenamenti), 
> gestione dei voti e condivisione di nuove attività.

### Metodi implementati

#### `getPastiBacheca()`

**Firma:** `getPastiBacheca(): Observable<any[]>`

**Scopo:** recupera l'elenco dei pasti condivisi in bacheca.

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/bacheca/pastiBacheca`.

>[!example] Parametri:
>Restituisce in output un `Observable<any[]>` contenente l'elenco dei pasti 
>condivisi in bacheca

---

#### `getAllenamentiBacheca()`

**Firma:** `getAllenamentiBacheca(): Observable<any[]>`

**Scopo:** recupera l'elenco degli allenamenti condivisi in bacheca.

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/bacheca/allenamentiBacheca`.

>[!example] Parametri:
>Restituisce in output un `Observable<any[]>` contenente l'elenco degli 
>allenamenti condivisi in bacheca

---

#### `getVotiAttivita()`

**Firma:** `getVotiAttivita(id_attivita: number, tipologia_attivita: number): Observable<any[]>`

**Scopo:** recupera l'elenco dei voti ricevuti da una specifica attività 
(pasto o allenamento).

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/bacheca/votiAttivita`, passando id e tipologia dell'attività come 
query params.

>[!example] Parametri:
>Prende in input l'id `number` dell'attività e la `tipologia_attivita` 
>(`number`, pasto o allenamento)
>Restituisce in output un `Observable<any[]>` contenente l'elenco dei voti 
>ricevuti

---

#### `getSingolaAttivitaBacheca()`

**Firma:** `getSingolaAttivitaBacheca(id_attivita: number, tipologia_attivita: number): Observable<any>`

**Scopo:** verifica se una specifica attività è già stata condivisa in 
bacheca, utilizzato per evitare condivisioni duplicate.

**Funzionamento:** esegue una richiesta HTTP GET verso 
`/api/bacheca/singolaAttivita`, con lo stesso pattern di query params del 
metodo precedente.

>[!example] Parametri:
>Prende in input l'id `number` dell'attività e la `tipologia_attivita` 
>(`number`)
>Restituisce in output un `Observable<any>` contenente l'esito della verifica

---

#### `condividiAttivita()`

**Firma:** `condividiAttivita(id_attivita: number, tipologia_attivita: number)`

**Scopo:** condivide un'attività (pasto o allenamento) in bacheca.

**Funzionamento:** esegue una richiesta HTTP POST verso 
`/api/bacheca/condividiAttivita`.

>[!example] Parametri:
>Prende in input l'id `number` dell'attività e la `tipologia_attivita` 
>(`number`) da condividere
>Restituisce in output un `Observable<any>` contenente l'intera risposta HTTP

---

#### `votaAttivita()`

**Firma:** `votaAttivita(attivita: {id: number, valutazione: number, tipologia: number}): Observable<any>`

**Scopo:** invia la valutazione assegnata a un'attività condivisa.

**Funzionamento:** esegue una richiesta HTTP POST verso 
`/api/bacheca/votaAttivita`.

>[!example] Parametri:
>Prende in input l'oggetto `attivita` composto da `id`, `valutazione` e 
>`tipologia` (tutti `number`)
>Restituisce in output un `Observable<any>` contenente l'intera risposta HTTP



---
---

## App Component

> [!abstract] Descrizione
> Questo componente rappresenta la shell principale dell'applicazione, 
> contenente il menu laterale di navigazione e il router outlet in cui 
> vengono renderizzate le singole pagine. Gestisce inoltre una correzione 
> manuale della visibilità delle pagine nello stack di navigazione.

### Metodi implementati

#### `ngOnInit()`

**Funzionamento:** si sottoscrive agli eventi del router, filtrando solo gli 
eventi di tipo `NavigationEnd` (cioè le navigazioni effettivamente 
completate), chiamando `updatePageVisibility()` a ogni cambio di rotta. 
Chiama inoltre lo stesso metodo una volta al primo caricamento del 
componente, per garantire lo stato corretto fin dall'avvio dell'app.

---

#### `updatePageVisibility()`

**Scopo:** corregge manualmente la visibilità delle pagine impilate nello 
stack di navigazione di Ionic, nascondendo tutte le pagine tranne quella 
attiva.

**Funzionamento:** seleziona tramite `document.querySelector` l'elemento 
`ion-router-outlet`, quindi tutti i suoi figli diretti (che rappresentano le 
pagine attualmente nello stack). Per ciascuna pagina:
- se è l'ultima nell'elenco (la pagina correntemente attiva), rimuove gli 
  attributi `ion-page-hidden` e `aria-hidden`, rendendola visibile e 
  accessibile
- per tutte le altre, imposta `ion-page-hidden` e `aria-hidden="true"`, 
  nascondendole sia visivamente sia agli screen reader, e rimuove il focus 
  da eventuali elementi ancora attivi al loro interno

---

#### `onLogout()`

**Firma:** `onLogout(): Promise<void>`

**Scopo:** gestisce il logout dell'utente dal menu laterale.

**Funzionamento:** chiama `onLogoutSuccess()` del `LoginService`, delegando 
a quest'ultimo la pulizia dello stato di autenticazione e il reindirizzamento 
alla pagina di login.


---
---



## **Funzionalità Back-end**


<center><h1> Controllers </h1></center>

## Auth Controllers

> [!abstract] Descrizione
> Questo controller espone gli endpoint HTTP relativi all'autenticazione, 
> facendo da livello di collegamento tra le richieste in arrivo e la logica 
> di business implementata in `AuthServices`.

### Metodi implementati

#### `login`

**Firma:** `login = async (req, res)`

**Scopo:** gestisce l'endpoint di login, restituendo il token JWT in caso di 
successo.

**Funzionamento:** estrae email e password dal corpo della richiesta, chiama 
`AuthServices.login()` e restituisce lo status, il messaggio e il token 
ricevuti come risposta. In caso di errore, restituisce lo status dell'errore 
(o `500` come fallback) con il relativo messaggio.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `register`

**Firma:** `register = async (req, res)`

**Scopo:** gestisce l'endpoint di registrazione di un nuovo utente.

**Funzionamento:** estrae i dati di registrazione dal corpo della richiesta, 
chiama `AuthServices.registration()` e restituisce sempre status `201` con 
i dati dell'utente creato. In caso di errore, restituisce lo status 
dell'errore (o `400` come fallback) con il relativo messaggio.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getRuoliProfessionisti`

**Firma:** `getRuoliProfessionisti = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero delle specializzazioni 
professionali disponibili.

**Funzionamento:** chiama `AuthServices.getRuoliProfessionisti()` e 
restituisce il risultato con status `201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express



---
---

## Pasti Controllers

> [!abstract] Descrizione
> Questo controller espone gli endpoint HTTP relativi alla gestione dei 
> pasti, facendo da livello di collegamento tra le richieste in arrivo e la 
> logica di business implementata in `PastiServices`.

### Metodi implementati

#### `getAlimenti`

**Firma:** `getAlimenti = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero dell'elenco completo degli 
alimenti.

**Funzionamento:** chiama `PastiServices.getAllAlimenti()` e restituisce il 
risultato in formato JSON.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getAlimentoById`

**Firma:** `getAlimentoById = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero di un singolo alimento a 
partire dal suo id.

**Funzionamento:** estrae l'id dai parametri della route, chiama 
`PastiServices.getAlimentoById()`; se l'alimento non viene trovato, 
restituisce status `404`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getPasti` / `getAlimentiPasti`

**Firma:** `getPasti = async (req, res)` / `getAlimentiPasti = async (req, res)`

**Scopo:** gestiscono gli endpoint per il recupero, rispettivamente, di 
tutti i pasti nel sistema e di tutte le associazioni pasto-alimento.

**Funzionamento:** chiamano i rispettivi metodi di `PastiServices`, 
restituendo il risultato in formato JSON.

>[!example] Parametri:
>Prendono in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getDettagliPasto`

**Firma:** `getDettagliPasto = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero dei dettagli nutrizionali di 
un singolo pasto.

**Funzionamento:** estrae l'id dai parametri della route, chiama 
`PastiServices.getDettagliPasto()`; se il pasto non viene trovato, 
restituisce status `404`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getPastoById`

**Firma:** `getPastoById = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero di un singolo pasto a partire 
dal suo id.

**Funzionamento:** estrae l'id dai parametri della route, chiama 
`PastiServices.getPastoById()`; se il pasto non viene trovato, restituisce 
status `404`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getPastiUtente` / `getPastiProgrammati`

**Firma:** `getPastiUtente = async (req, res)` / `getPastiProgrammati = async (req, res)`

**Scopo:** gestiscono gli endpoint per il recupero, rispettivamente, di tutti 
i pasti dell'utente autenticato e dei soli pasti già programmati nel 
calendario.

**Funzionamento:** recuperano l'id dell'utente da `req.user.id`, chiamano i 
rispettivi metodi di `PastiServices` e restituiscono il risultato in formato 
JSON.

>[!example] Parametri:
>Prendono in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `checkPasto`

**Firma:** `checkPasto = async (req, res)`

**Scopo:** gestisce l'endpoint per verificare se esiste già un pasto con 
determinati nome e tipo per l'utente autenticato.

**Funzionamento:** estrae nome e tipo dal corpo della richiesta e l'id 
utente da `req.user.id`, chiama `PastiServices.checkPasto()` e restituisce 
un oggetto `{exists}` con status `201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `creaPasti`

**Firma:** `creaPasti = async (req, res)`

**Scopo:** gestisce l'endpoint per la creazione di un nuovo pasto.

**Funzionamento:** estrae nome, tipo e data di creazione dal corpo della 
richiesta e l'id utente da `req.user.id`, chiama `PastiServices.creaPasti()` 
e restituisce l'id del pasto creato con status `201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `riempiPasto`

**Firma:** `riempiPasto = async (req, res)`

**Scopo:** gestisce l'endpoint per l'inserimento degli alimenti di un pasto.

**Funzionamento:** estrae id del pasto ed elenco alimenti dal corpo della 
richiesta, chiama `PastiServices.riempiPasto()` e restituisce l'esito con 
status `201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `modificaPasto`

**Firma:** `modificaPasto = async (req, res)`

**Scopo:** gestisce l'endpoint per la modifica degli alimenti di un pasto 
esistente.

**Funzionamento:** estrae id del pasto e modifiche dal corpo della richiesta, 
chiama `PastiServices.modificaPasto()` e restituisce il risultato con status 
`201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `programmaPasto`

**Firma:** `programmaPasto = async (req, res)`

**Scopo:** gestisce l'endpoint per la programmazione di un pasto nel 
calendario.

**Funzionamento:** estrae id del pasto e data dal corpo della richiesta, 
chiama `PastiServices.programmaPasto()` e restituisce il risultato con status 
`201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `clonaPasto`

**Firma:** `clonaPasto = async (req, res)`

**Scopo:** gestisce l'endpoint per la clonazione di un pasto condiviso in 
bacheca nel profilo dell'utente autenticato.

**Funzionamento:** estrae l'id del pasto da clonare dal corpo della richiesta 
e l'id dell'utente autenticato da `req.user.id`, chiama 
`PastiServices.clonaPasto()` e restituisce l'esito con status `201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `disdiciPasto`

**Firma:** `disdiciPasto = async (req, res)`

**Scopo:** gestisce l'endpoint per la rimozione della programmazione di un 
pasto dal calendario.

**Funzionamento:** estrae id del pasto e data dal corpo della richiesta, 
chiama `PastiServices.disdiciPasto()` e restituisce un messaggio di conferma 
con status `201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `eliminaPasto`

**Firma:** `eliminaPasto = async (req, res)`

**Scopo:** gestisce l'endpoint per l'eliminazione definitiva di un pasto.

**Funzionamento:** estrae l'id del pasto dai parametri della route, chiama 
`PastiServices.eliminaPasto()` e restituisce un messaggio di conferma con 
status `201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express




---
---

## Allenamenti Controllers

> [!abstract] Descrizione
> Questo controller espone gli endpoint HTTP relativi alla gestione degli 
> allenamenti, facendo da livello di collegamento tra le richieste in arrivo 
> e la logica di business implementata in `AllenamentiServices`.

### Metodi implementati

#### `getEsercizi`

**Firma:** `getEsercizi = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero dell'elenco completo degli 
esercizi.

**Funzionamento:** chiama `AllenamentiServices.getAllEsercizi()` e restituisce 
il risultato in formato JSON.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getEsercizioById`

**Firma:** `getEsercizioById = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero di un singolo esercizio a 
partire dal suo id.

**Funzionamento:** estrae l'id dai parametri della route, chiama 
`AllenamentiServices.getEsercizioById()`; se l'esercizio non viene trovato, 
restituisce status `404`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getAllenamenti` / `getEserciziAllenamenti`

**Firma:** `getAllenamenti = async (req, res)` / `getEserciziAllenamenti = async (req, res)`

**Scopo:** gestiscono gli endpoint per il recupero, rispettivamente, di 
tutti gli allenamenti nel sistema e di tutte le associazioni 
allenamento-esercizio.

**Funzionamento:** chiamano i rispettivi metodi di `AllenamentiServices`, 
restituendo il risultato in formato JSON.

>[!example] Parametri:
>Prendono in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getDettagliAllenamento`

**Firma:** `getDettagliAllenamento = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero degli esercizi associati a 
un singolo allenamento.

**Funzionamento:** estrae l'id dai parametri della route, chiama 
`AllenamentiServices.getDettagliAllenamento()`; se l'allenamento non viene 
trovato, restituisce status `400`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getAllenamentoById`

**Firma:** `getAllenamentoById = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero di un singolo allenamento a 
partire dal suo id.

**Funzionamento:** estrae l'id dai parametri della route, chiama 
`AllenamentiServices.getAllenamentoById()`; se l'allenamento non viene 
trovato, restituisce status `404`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getAllenamentiUtente`

**Firma:** `getAllenamentiUtente = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero di tutti gli allenamenti 
dell'utente autenticato.

**Funzionamento:** recupera l'id dell'utente da `req.user.id`, chiama 
`AllenamentiServices.getAllenamentiUtente()` e restituisce il risultato in 
formato JSON.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `checkAllenamento`

**Firma:** `checkAllenamento = async (req, res)`

**Scopo:** gestisce l'endpoint per verificare se esiste già un allenamento 
programmato per un determinato giorno per l'utente autenticato.

**Funzionamento:** estrae il giorno dal corpo della richiesta e l'id utente 
da `req.user.id`, chiama `AllenamentiServices.checkAllenamento()` e 
restituisce un oggetto `{exists}` con status `200`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `creaAllenamenti`

**Firma:** `creaAllenamenti = async (req, res)`

**Scopo:** gestisce l'endpoint per la creazione di un nuovo allenamento.

**Funzionamento:** estrae nome, giorno, durata e data di creazione dal corpo 
della richiesta e l'id utente da `req.user.id`, chiama 
`AllenamentiServices.creaAllenamenti()` e restituisce l'id dell'allenamento 
creato con status `201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `riempiAllenamento`

**Firma:** `riempiAllenamento = async (req, res)`

**Scopo:** gestisce l'endpoint per l'inserimento degli esercizi di un 
allenamento.

**Funzionamento:** estrae id dell'allenamento ed elenco esercizi dal corpo 
della richiesta, chiama `AllenamentiServices.riempiAllenamento()` e 
restituisce l'esito con status `201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `modificaAllenamento`

**Firma:** `modificaAllenamento = async (req, res)`

**Scopo:** gestisce l'endpoint per la modifica degli esercizi di un 
allenamento esistente.

**Funzionamento:** estrae id dell'allenamento e modifiche dal corpo della 
richiesta, chiama `AllenamentiServices.modificaAllenamento()` e restituisce 
il risultato con status `201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `programmaAllenamento`

**Firma:** `programmaAllenamento = async (req, res)`

**Scopo:** gestisce l'endpoint per la programmazione di un allenamento nel 
calendario.

**Funzionamento:** estrae id dell'allenamento e data dal corpo della 
richiesta, chiama `AllenamentiServices.programmaAllenamento()` e restituisce 
il risultato con status `201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `clonaAllenamento`

**Firma:** `clonaAllenamento = async (req, res)`

**Scopo:** gestisce l'endpoint per la clonazione di un allenamento condiviso 
in bacheca nel profilo dell'utente autenticato.

**Funzionamento:** estrae l'id dell'allenamento da clonare dal corpo della 
richiesta e l'id dell'utente autenticato da `req.user.id`, chiama 
`AllenamentiServices.clonaAllenamento()` e restituisce l'esito con status 
`201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `eliminaAllenamento`

**Firma:** `eliminaAllenamento = async (req, res)`

**Scopo:** gestisce l'endpoint per l'eliminazione definitiva di un 
allenamento.

**Funzionamento:** estrae l'id dell'allenamento dai parametri della route, 
chiama `AllenamentiServices.eliminaAllenamento()` e restituisce un messaggio 
di conferma con status `201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express



---
---

## User Controllers

> [!abstract] Descrizione
> Questo controller espone gli endpoint HTTP relativi alla gestione degli 
> utenti, facendo da livello di collegamento tra le richieste in arrivo e la 
> logica di business implementata in `UserServices`.

### Metodi implementati

#### `getUsers`

**Firma:** `getUsers = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero dell'elenco completo degli 
utenti.

**Funzionamento:** chiama `UserServices.getAllUsers()` e restituisce il 
risultato in formato JSON.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getUtenteById`

**Firma:** `getUtenteById = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero dei dati anagrafici di un 
singolo utente.

**Funzionamento:** estrae l'id dai parametri della route, chiama 
`UserServices.getUtenteById()`; se i dati non vengono trovati, restituisce 
status `404`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getInfoUtenteById`

**Firma:** `getInfoUtenteById = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero delle informazioni fisiche di 
un singolo utente.

**Funzionamento:** estrae l'id dai parametri della route, chiama 
`UserServices.getInfoUtenteById()`; se le informazioni non vengono trovate, 
restituisce status `404`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getUtentiByRuolo`

**Firma:** `getUtentiByRuolo = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero degli utenti che ricoprono un 
determinato ruolo.

**Funzionamento:** estrae il ruolo dai parametri della route, chiama 
`UserServices.getUtentiByRuolo()`; se non vengono trovati utenti, restituisce 
status `404`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getAlbo`

**Firma:** `getAlbo = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero dell'albo professionale.

**Funzionamento:** chiama `UserServices.getAlbo()`; se non viene trovato 
alcun risultato, restituisce status `404`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getRichieste`

**Firma:** `getRichieste = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero dell'elenco generale delle 
richieste.

**Funzionamento:** chiama `UserServices.getRichieste()`; se non viene 
trovato alcun risultato, restituisce status `404`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getRuoloProfessionista`

**Firma:** `getRuoloProfessionista = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero del ruolo/specializzazione di 
un professionista.

**Funzionamento:** estrae l'id dai parametri della route, chiama 
`UserServices.getRuoloProfessionista()`; se il ruolo non viene trovato, 
restituisce status `404`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getAssociazioniUtente`

**Firma:** `getAssociazioniUtente = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero delle associazioni 
dell'utente autenticato con i professionisti.

**Funzionamento:** recupera l'id dell'utente da `req.user.id`, chiama 
`UserServices.getAssociazioniUtente()`; se non vengono trovate associazioni, 
restituisce status `404`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getAssociazioniProfessionista`

**Firma:** `getAssociazioniProfessionista = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero delle associazioni del 
professionista autenticato con i propri clienti.

**Funzionamento:** recupera l'id del professionista da `req.user.id`, chiama 
`UserServices.getAssociazioniProfessionista()`; se non vengono trovate 
associazioni, restituisce status `404`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getRichiesteUtente` / `getRichiesteProfessionista`

**Firma:** `getRichiesteUtente = async (req, res)` / `getRichiesteProfessionista = async (req, res)`

**Scopo:** gestiscono gli endpoint per il recupero delle richieste, 
rispettivamente, inviate dall'utente e ricevute dal professionista 
autenticato.

**Funzionamento:** recuperano l'id da `req.user.id`, chiamano i rispettivi 
metodi di `UserServices`; se non vengono trovate richieste, restituiscono 
status `404`.

>[!example] Parametri:
>Prendono in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getAssociazioniPending` / `getRichiestePending`

**Firma:** `getAssociazioniPending = async (req, res)` / `getRichiestePending = async (req, res)`

**Scopo:** gestiscono gli endpoint per il recupero, rispettivamente, delle 
associazioni e delle richieste in attesa di approvazione da parte del 
professionista autenticato.

**Funzionamento:** recuperano l'id da `req.user.id`, chiamano i rispettivi 
metodi di `UserServices`; se non vengono trovati risultati, restituiscono 
status `404`.

>[!example] Parametri:
>Prendono in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getFeedAssociati`

**Firma:** `getFeedAssociati = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero del feed delle attività 
recenti tracciate dai clienti associati al professionista autenticato.

**Funzionamento:** recupera l'id dell'utente da `req.user.id`, chiama 
`UserServices.getFeedAssociati()`; se non viene trovato alcun risultato, 
restituisce status `404`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `creaAssociazione`

**Firma:** `creaAssociazione = async (req, res)`

**Scopo:** gestisce l'endpoint per l'invio di una richiesta di associazione 
a un professionista.

**Funzionamento:** estrae `id_persona` dal corpo della richiesta e l'id 
dell'utente da `req.user.id`, chiama `UserServices.creaAssociazione()` e 
restituisce l'esito con status `201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `accettaAssociazione`

**Firma:** `accettaAssociazione = async (req, res)`

**Scopo:** gestisce l'endpoint per l'accettazione di una richiesta di 
associazione.

**Funzionamento:** estrae `id_associazione` dal corpo della richiesta, 
chiama `UserServices.accettaAssociazione()` e restituisce l'esito con status 
`201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `creaRichiesta`

**Firma:** `creaRichiesta = async (req, res)`

**Scopo:** gestisce l'endpoint per l'invio di una richiesta di modifica o 
votazione relativa a un pasto o allenamento.

**Funzionamento:** estrae `dati` dal corpo della richiesta e l'id dell'utente 
da `req.user.id`, chiama `UserServices.creaRichiesta()` e restituisce l'esito 
con status `201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `accettaRichiesta`

**Firma:** `accettaRichiesta = async (req, res)`

**Scopo:** gestisce l'endpoint per l'accettazione di una richiesta di 
modifica o votazione.

**Funzionamento:** estrae `richiesta` dal corpo della richiesta, chiama 
`UserServices.accettaRichiesta()` e restituisce l'esito con status `201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `riempiInfo`

**Firma:** `riempiInfo = async (req, res)`

**Scopo:** gestisce l'endpoint per l'aggiornamento delle informazioni 
fisiche dell'utente.

**Funzionamento:** estrae `info` dal corpo della richiesta, chiama 
`UserServices.riempiInfo()` e restituisce l'esito con status `201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `aggiornaPassword`

**Firma:** `aggiornaPassword = async (req, res)`

**Scopo:** gestisce l'endpoint per l'aggiornamento della password 
dell'utente autenticato.

**Funzionamento:** recupera l'id dell'utente da `req.user.id`, estrae 
`vecchiaPassword` e `nuovaPassword` dal corpo della richiesta, chiama 
`UserServices.aggiornaPassword()` e restituisce l'esito con status `201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `annullaAssociazione`

**Firma:** `annullaAssociazione = async (req, res)`

**Scopo:** gestisce l'endpoint per l'annullamento di un'associazione.

**Funzionamento:** estrae l'id dell'associazione dai parametri della route, 
chiama `UserServices.annullaAssociazione()` e restituisce l'esito con status 
`201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `annullaRichiesta`

**Firma:** `annullaRichiesta = async (req, res)`

**Scopo:** gestisce l'endpoint per l'annullamento di una richiesta di 
modifica o votazione.

**Funzionamento:** estrae l'id della richiesta dai parametri della route, 
chiama `UserServices.annullaRichiesta()` e restituisce l'esito con status 
`201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express


---
---

## Bacheca Controllers

> [!abstract] Descrizione
> Questo controller espone gli endpoint HTTP relativi alla bacheca 
> condivisa, facendo da livello di collegamento tra le richieste in arrivo e 
> la logica di business implementata in `BachecaServices`.

### Metodi implementati

#### `getPastiBacheca`

**Firma:** `getPastiBacheca = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero dei pasti condivisi in 
bacheca.

**Funzionamento:** chiama `BachecaServices.getPastiBacheca()`; se non viene 
trovato alcun risultato, restituisce status `404`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getAllenamentiBacheca`

**Firma:** `getAllenamentiBacheca = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero degli allenamenti condivisi 
in bacheca.

**Funzionamento:** chiama `BachecaServices.getAllenamentiBacheca()`; se non 
viene trovato alcun risultato, restituisce status `404`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getSingolaAttivitaBacheca`

**Firma:** `getSingolaAttivitaBacheca = async (req, res)`

**Scopo:** gestisce l'endpoint per verificare se una specifica attività è 
già stata condivisa in bacheca dall'utente autenticato.

**Funzionamento:** recupera l'id dell'utente da `req.user.id`, estrae 
`id_attivita` e `tipologia_attivita` dai query params, chiama 
`BachecaServices.getSingolaAttivitaBacheca()` e restituisce l'esito con 
status `201`; se non viene trovato alcun risultato, restituisce status `404`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `getVotiAttivita`

**Firma:** `getVotiAttivita = async (req, res)`

**Scopo:** gestisce l'endpoint per il recupero dei voti ricevuti da una 
specifica attività.

**Funzionamento:** estrae `id_attivita` e `tipologia_attivita` dai query 
params, chiama `BachecaServices.getVotiAttivita()`; se non vengono trovati 
voti, restituisce status `404`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `condividiAttivita`

**Firma:** `condividiAttivita = async (req, res)`

**Scopo:** gestisce l'endpoint per la condivisione di un'attività (pasto o 
allenamento) in bacheca.

**Funzionamento:** recupera l'id dell'utente da `req.user.id`, estrae 
`id_attivita` e `tipologia_attivita` dal corpo della richiesta, chiama 
`BachecaServices.condividiAttivita()` e restituisce l'esito con status `201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express

---

#### `votaAttivita`

**Firma:** `votaAttivita = async (req, res)`

**Scopo:** gestisce l'endpoint per l'invio di una valutazione a un'attività 
condivisa.

**Funzionamento:** recupera l'id dell'utente da `req.user.id`, estrae 
`attivita` dal corpo della richiesta, chiama `BachecaServices.votaAttivita()` 
e restituisce l'esito con status `201`.

>[!example] Parametri:
>Prende in input `req` e `res`, gli oggetti richiesta e risposta di Express



---
---

<center><h1> Services </h1></center>

## Auth Services

> [!abstract] Descrizione
> Questo servizio gestisce la logica di autenticazione: login con generazione 
> del token JWT, registrazione di nuovi utenti (con eventuale iscrizione a 
> una specializzazione professionale) e recupero dei ruoli professionali 
> disponibili.

### Metodi implementati

#### `login()`

**Firma:** `static async login(email, password)`

**Scopo:** verifica le credenziali di un utente e genera un token JWT in 
caso di successo.

**Funzionamento:**
1. Cerca l'utente per email; se non esiste, lancia un errore con status `401`
2. Verifica la corrispondenza della password tramite `User.comparePassword`
3. Se la verifica ha successo, genera un token JWT contenente id, email e 
   ruolo dell'utente, con scadenza di 2 ore, firmato con `CHIAVE_SEGRETA`
4. Restituisce il token insieme a un messaggio di conferma

>[!example] Parametri:
>Prende in input `email` e `password`
>Restituisce in output un oggetto contenente `status`, `message` e `token`

---

#### `registration()`

**Firma:** `static async registration(ruolo, id_ruolo_professionista, nome, cognome, email, password)`

**Scopo:** registra un nuovo utente nel sistema, con eventuale iscrizione a 
una specializzazione professionale.

**Funzionamento:**
1. Verifica che l'email non sia già in uso; in caso contrario, lancia un 
   errore
2. Crea il nuovo utente tramite `User.create()`
3. Se il ruolo indica un professionista (`ruolo > 0`) ed è stato fornito un 
   `id_ruolo_professionista`, associa l'utente alla specializzazione tramite 
   `User.iscriviProfessionista()`
4. Restituisce l'utente creato

>[!example] Parametri:
>Prende in input `ruolo`, `id_ruolo_professionista`, `nome`, `cognome`, 
>`email` e `password`
>Restituisce in output l'oggetto `user` appena creato

---

#### `getRuoliProfessionisti()`

**Firma:** `static async getRuoliProfessionisti()`

**Scopo:** recupera l'elenco delle specializzazioni professionali disponibili.

**Funzionamento:** delega direttamente al model `User.getRuoliProfessionisti()`.

>[!example] Parametri:
>Restituisce in output l'elenco delle specializzazioni professionali 
>disponibili



---
---

## Pasti Services

> [!abstract] Descrizione
> Questo servizio gestisce la logica di business relativa ai pasti: recupero 
> dati (alimenti, pasti, dettagli nutrizionali), creazione, modifica, 
> programmazione nel calendario, clonazione ed eliminazione.

### Metodi implementati

#### `getAllAlimenti()`

**Firma:** `static async getAllAlimenti()`

**Scopo:** recupera l'elenco completo degli alimenti disponibili nel database.

**Funzionamento:** delega direttamente al model `Pasti.getAllAlimenti()`.

>[!example] Parametri:
>Restituisce in output l'elenco completo degli alimenti

---

#### `getAlimentoById()`

**Firma:** `static async getAlimentoById(id_alimento)`

**Scopo:** recupera i dati di un singolo alimento a partire dal suo id.

**Funzionamento:** delega al model `Pasti.getAlimentoById()`; se l'alimento 
non viene trovato, restituisce `null` invece di lanciare un errore.

>[!example] Parametri:
>Prende in input l'`id_alimento` dell'alimento da recuperare
>Restituisce in output l'oggetto `alimento`, oppure `null` se non trovato

---

#### `getAllPasti()` / `getAllAlimentiPasti()`

**Firma:** `static async getAllPasti()` / `static async getAllAlimentiPasti()`

**Scopo:** recuperano rispettivamente l'elenco completo di tutti i pasti e 
l'elenco delle associazioni pasto-alimento nel sistema.

**Funzionamento:** delegano direttamente ai rispettivi metodi del model 
`Pasti`.

>[!example] Parametri:
>Restituiscono in output rispettivamente l'elenco di tutti i pasti e 
>l'elenco delle associazioni pasto-alimento

---

#### `getDettagliPasto()`

**Firma:** `static async getDettagliPasto(id_pasto)`

**Scopo:** recupera gli alimenti e i valori nutrizionali associati a un 
singolo pasto.

**Funzionamento:** verifica preventivamente l'esistenza del pasto tramite 
`Pasti.findPastoById()`; se non esiste, restituisce `null`. Altrimenti, 
recupera i dettagli tramite `Pasti.getDettagliPasto()`, passando sia l'id 
sia l'oggetto pasto già recuperato.

>[!example] Parametri:
>Prende in input l'`id_pasto` di cui recuperare i dettagli
>Restituisce in output l'oggetto `dettagli_pasto`, oppure `null` se il pasto 
>non esiste o i dettagli non vengono trovati

---

#### `getPastoById()`

**Firma:** `static async getPastoById(id_pasto)`

**Scopo:** recupera i dati di un singolo pasto a partire dal suo id.

**Funzionamento:** delega a `Pasti.findPastoById()`, restituendo `null` se 
il pasto non viene trovato.

>[!example] Parametri:
>Prende in input l'`id_pasto` da recuperare
>Restituisce in output l'oggetto `pasto`, oppure `null` se non trovato

---

#### `getPastiUtente()` / `getPastiProgrammati()`

**Firma:** `static async getPastiUtente(user_id)` / `static async getPastiProgrammati(user_id)`

**Scopo:** recuperano rispettivamente l'elenco completo dei pasti di un 
utente e l'elenco dei soli pasti già programmati nel calendario.

**Funzionamento:** delegano ai rispettivi metodi del model `Pasti`, 
restituendo un array vuoto (anziché `null`) se non vengono trovati risultati.

>[!example] Parametri:
>Prendono in input lo `user_id` dell'utente
>Restituiscono in output l'elenco dei pasti (completo o programmati), 
>oppure un array vuoto se non ne esistono

---

#### `checkPasto()`

**Firma:** `static async checkPasto(user_id, nome, tipo)`

**Scopo:** verifica se esiste già un pasto con lo stesso nome e tipo per un 
determinato utente.

**Funzionamento:** delega a `Pasti.checkPasto()`, restituendo `null` in 
assenza di risultati.

>[!example] Parametri:
>Prende in input `user_id`, `nome` e `tipo`
>Restituisce in output l'oggetto `pasto` trovato, oppure `null` se non esiste

---

#### `creaPasti()`

**Firma:** `static async creaPasti(user_id, nome, tipo, data_creazione)`

**Scopo:** crea un nuovo pasto nel database.

**Funzionamento:** delega a `Pasti.creaPasti()`; se la creazione fallisce, 
lancia un errore esplicito.

>[!example] Parametri:
>Prende in input `user_id`, `nome`, `tipo` e `data_creazione`
>Restituisce in output l'oggetto `nuovoPasto` appena creato

---

#### `riempiPasto()`

**Firma:** `static async riempiPasto(id_pasto, alimenti)`

**Scopo:** associa a un pasto l'elenco degli alimenti che lo compongono.

**Funzionamento:** delega a `Pasti.riempiPasto()`; se l'operazione fallisce, 
lancia un errore esplicito.

>[!example] Parametri:
>Prende in input l'`id_pasto` e l'array `alimenti`
>Restituisce in output il `contenutoPasto` inserito

---

#### `modificaPasto()`

**Firma:** `static async modificaPasto(id_pasto, modifiche_pasto)`

**Scopo:** sostituisce gli alimenti associati a un pasto esistente con un 
nuovo elenco.

**Funzionamento:** verifica l'esistenza del pasto; se presente, elimina 
prima tutti i dettagli esistenti tramite `Pasti.eliminaDettagliPasto()`, poi 
reinserisce il nuovo elenco tramite `Pasti.riempiPasto()`. L'approccio è 
quindi "elimina e ricrea" piuttosto che un aggiornamento differenziale dei 
singoli alimenti.

>[!example] Parametri:
>Prende in input l'`id_pasto` e l'array `modifiche_pasto`
>Restituisce in output il `result` dell'inserimento, oppure `null` se il 
>pasto non esiste

---

#### `programmaPasto()` / `disdiciPasto()`

**Firma:** `static async programmaPasto(id_pasto, data_calendario)` / 
`static async disdiciPasto(id_pasto, data_calendario)`

**Scopo:** gestiscono rispettivamente la programmazione e la rimozione della 
programmazione di un pasto in una data del calendario.

**Funzionamento:** delegano ai rispettivi metodi del model `Pasti`; in caso 
di fallimento, lanciano un errore esplicito.

>[!example] Parametri:
>Prendono in input l'`id_pasto` e la `data_calendario`
>Restituiscono in output l'esito dell'operazione (`programmato` o `disdetto`)

---

#### `clonaPasto()`

**Firma:** `static async clonaPasto(id_pasto, id_nuovo_utente)`

**Scopo:** duplica un pasto esistente (inclusi i relativi alimenti) 
assegnandolo a un nuovo utente, utilizzato per clonare un pasto condiviso 
in bacheca nel proprio profilo.

**Funzionamento:**
1. Recupera i dati del pasto originale tramite `Pasti.findPastoById()`
2. Crea un nuovo pasto con lo stesso nome e tipo, associato a `id_nuovo_utente`
3. Recupera i dettagli (alimenti) del pasto originale
4. Se non sono presenti alimenti, restituisce comunque il nuovo pasto creato 
   (clonato senza dettagli)
5. Altrimenti, ricostruisce l'elenco degli alimenti nel formato atteso da 
   `riempiPasto()` e lo associa al nuovo pasto

>[!example] Parametri:
>Prende in input l'`id_pasto` da clonare e l'`id_nuovo_utente` destinatario
>Restituisce in output i `dettagli_inseriti` del nuovo pasto clonato, oppure 
>il solo `id_nuovo_pasto` se il pasto originale non aveva dettagli, oppure 
>`null` se il pasto originale non viene trovato

---

#### `eliminaPasto()`

**Firma:** `static async eliminaPasto(id_pasto)`

**Scopo:** elimina definitivamente un pasto dal database.

**Funzionamento:** delega a `Pasti.eliminaPasto()`; se l'operazione fallisce 
o il pasto non viene trovato, lancia un errore esplicito.

>[!example] Parametri:
>Prende in input l'`id_pasto` da eliminare
>Restituisce in output il `risultatoEliminazione`



---
---

## Allenamenti Services

> [!abstract] Descrizione
> Questo servizio gestisce la logica di business relativa agli allenamenti: 
> recupero dati (esercizi, allenamenti, dettagli), creazione, modifica, 
> programmazione nel calendario, clonazione ed eliminazione. La struttura è 
> speculare a quella di `PastiServices`.

### Metodi implementati

#### `getAllEsercizi()`

**Firma:** `static async getAllEsercizi()`

**Scopo:** recupera l'elenco completo degli esercizi disponibili nel 
database.

**Funzionamento:** delega direttamente al model `Allenamenti.getAllEsercizi()`.

>[!example] Parametri:
>Restituisce in output l'elenco completo degli esercizi

---

#### `getEsercizioById()`

**Firma:** `static async getEsercizioById(id_esercizio)`

**Scopo:** recupera i dati di un singolo esercizio a partire dal suo id.

**Funzionamento:** delega al model `Allenamenti.getEsercizioById()`; se 
l'esercizio non viene trovato, restituisce `null` invece di lanciare un 
errore.

>[!example] Parametri:
>Prende in input l'`id_esercizio` dell'esercizio da recuperare
>Restituisce in output l'oggetto `esercizio`, oppure `null` se non trovato

---

#### `getAllAllenamenti()` / `getAllEserciziAllenamento()`

**Firma:** `static async getAllAllenamenti()` / `static async getAllEserciziAllenamento()`

**Scopo:** recuperano rispettivamente l'elenco completo di tutti gli 
allenamenti e l'elenco delle associazioni allenamento-esercizio nel sistema.

**Funzionamento:** delegano direttamente ai rispettivi metodi del model 
`Allenamenti`.

>[!example] Parametri:
>Restituiscono in output rispettivamente l'elenco di tutti gli allenamenti e 
>l'elenco delle associazioni allenamento-esercizio

---

#### `getDettagliAllenamento()`

**Firma:** `static async getDettagliAllenamento(id_allenamento)`

**Scopo:** recupera gli esercizi associati a un singolo allenamento.

**Funzionamento:** verifica preventivamente l'esistenza dell'allenamento 
tramite `Allenamenti.findAllenamentoById()`; se non esiste, restituisce 
`null`. Altrimenti, recupera i dettagli tramite 
`Allenamenti.getDettagliAllenamento()`, passando sia l'id sia l'oggetto 
allenamento già recuperato.

>[!example] Parametri:
>Prende in input l'`id_allenamento` di cui recuperare i dettagli
>Restituisce in output l'oggetto `dettagli_allenamento`, oppure `null` se 
>l'allenamento non esiste o i dettagli non vengono trovati

---

#### `getAllenamentoById()`

**Firma:** `static async getAllenamentoById(id_allenamento)`

**Scopo:** recupera i dati di un singolo allenamento a partire dal suo id.

**Funzionamento:** delega a `Allenamenti.findAllenamentoById()`, 
restituendo `null` se l'allenamento non viene trovato.

>[!example] Parametri:
>Prende in input l'`id_allenamento` da recuperare
>Restituisce in output l'oggetto `allenamento`, oppure `null` se non trovato

---

#### `getAllenamentiUtente()`

**Firma:** `static async getAllenamentiUtente(user_id)`

**Scopo:** recupera l'elenco completo degli allenamenti di un utente.

**Funzionamento:** delega a `Allenamenti.getAllenamentiUtente()`, 
restituendo un array vuoto (anziché `null`) se non vengono trovati risultati.

>[!example] Parametri:
>Prende in input lo `user_id` dell'utente
>Restituisce in output l'elenco degli allenamenti, oppure un array vuoto se 
>non ne esistono

---

#### `checkAllenamento()`

**Firma:** `static async checkAllenamento(user_id, giorno)`

**Scopo:** verifica se esiste già un allenamento programmato per un 
determinato giorno per un determinato utente.

**Funzionamento:** delega a `Allenamenti.checkAllenamento()`, restituendo 
`null` in assenza di risultati.

>[!example] Parametri:
>Prende in input `user_id` e `giorno`
>Restituisce in output l'oggetto `allenamento` trovato, oppure `null` se non 
>esiste

---

#### `creaAllenamenti()`

**Firma:** `static async creaAllenamenti(user_id, nome, giorno, durata, data_creazione)`

**Scopo:** crea un nuovo allenamento nel database.

**Funzionamento:** delega a `Allenamenti.creaAllenamenti()`; se la creazione 
fallisce, lancia un errore esplicito.

>[!example] Parametri:
>Prende in input `user_id`, `nome`, `giorno`, `durata` e `data_creazione`
>Restituisce in output l'oggetto `nuovoAllenamento` appena creato

---

#### `riempiAllenamento()`

**Firma:** `static async riempiAllenamento(id_allenamento, esercizi)`

**Scopo:** associa a un allenamento l'elenco degli esercizi che lo 
compongono.

**Funzionamento:** delega a `Allenamenti.riempiAllenamento()`; se 
l'operazione fallisce, lancia un errore esplicito.

>[!example] Parametri:
>Prende in input l'`id_allenamento` e l'array `esercizi`
>Restituisce in output il `contenutoAllenamento` inserito

---

#### `modificaAllenamento()`

**Firma:** `static async modificaAllenamento(id_allenamento, modifiche_allenamento)`

**Scopo:** sostituisce gli esercizi associati a un allenamento esistente con 
un nuovo elenco.

**Funzionamento:** verifica l'esistenza dell'allenamento; se presente, 
elimina prima tutti i dettagli esistenti tramite 
`Allenamenti.eliminaDettagliAllenamento()`, poi reinserisce il nuovo elenco 
tramite `Allenamenti.riempiAllenamento()`. L'approccio è quindi 
"elimina e ricrea", lo stesso già visto in `PastiServices.modificaPasto()`.

>[!example] Parametri:
>Prende in input l'`id_allenamento` e l'array `modifiche_allenamento`
>Restituisce in output il `result` dell'inserimento, oppure `null` se 
>l'allenamento non esiste

---

#### `programmaAllenamento()`

**Firma:** `static async programmaAllenamento(id_allenamento, data_calendario)`

**Scopo:** programma un allenamento esistente in una data del calendario.

**Funzionamento:** delega a `Allenamenti.programmaAllenamento()`; in caso di 
fallimento, lancia un errore esplicito.

>[!example] Parametri:
>Prende in input l'`id_allenamento` e la `data_calendario`
>Restituisce in output il `risultatoProgrammazione`

---

#### `clonaAllenamento()`

**Firma:** `static async clonaAllenamento(id_allenamento, id_nuovo_utente)`

**Scopo:** duplica un allenamento esistente (inclusi i relativi esercizi) 
assegnandolo a un nuovo utente, utilizzato per clonare un allenamento 
condiviso in bacheca nel proprio profilo.

**Funzionamento:**
1. Recupera i dati dell'allenamento originale tramite 
   `Allenamenti.findAllenamentoById()`
2. Crea un nuovo allenamento con lo stesso nome, data e durata, associato a 
   `id_nuovo_utente`, impostando `data_creazione` al momento corrente
3. Recupera i dettagli (esercizi) dell'allenamento originale
4. Se non sono presenti esercizi, restituisce comunque il nuovo allenamento 
   creato (clonato senza dettagli)
5. Altrimenti, ricostruisce l'elenco degli esercizi nel formato atteso da 
   `riempiAllenamento()` e lo associa al nuovo allenamento

>[!example] Parametri:
>Prende in input l'`id_allenamento` da clonare e l'`id_nuovo_utente` 
>destinatario
>Restituisce in output il risultato dell'inserimento degli esercizi nel 
>nuovo allenamento, oppure il solo `id_nuovo_allenamento` se l'allenamento 
>originale non aveva dettagli, oppure `null` se l'allenamento originale non 
>viene trovato

---

#### `eliminaAllenamento()`

**Firma:** `static async eliminaAllenamento(id_allenamento)`

**Scopo:** elimina definitivamente un allenamento dal database.

**Funzionamento:** delega a `Allenamenti.eliminaAllenamento()`; se 
l'operazione fallisce o l'allenamento non viene trovato, lancia un errore 
esplicito.

>[!example] Parametri:
>Prende in input l'`id_allenamento` da eliminare
>Restituisce in output il `risultatoEliminazione`



---
---

## User Services

> [!abstract] Descrizione
> Questo servizio gestisce la logica di business relativa agli utenti: dati 
> anagrafici e informazioni fisiche, password, associazioni tra utenti e 
> professionisti, e richieste di modifica/voto.

### Metodi implementati

#### `getUtenteById()`

**Firma:** `static async getUtenteById(id_utente)`

**Scopo:** recupera i dati anagrafici di un utente a partire dal suo id.

**Funzionamento:** delega a `User.findById()`, restituendo `null` se 
l'utente non viene trovato.

>[!example] Parametri:
>Prende in input l'`id_utente` da recuperare
>Restituisce in output l'oggetto `dati` dell'utente, oppure `null` se non 
>trovato

---

#### `getInfoUtenteById()`

**Firma:** `static async getInfoUtenteById(id_utente)`

**Scopo:** recupera le informazioni fisiche di un utente a partire dal suo id.

**Funzionamento:** delega a `User.findInfo()`, restituendo `null` se le 
informazioni non vengono trovate.

>[!example] Parametri:
>Prende in input l'`id_utente` di cui recuperare le informazioni
>Restituisce in output l'oggetto `info`, oppure `null` se non trovato

---

#### `getAllUsers()`

**Firma:** `static async getAllUsers()`

**Scopo:** recupera l'elenco completo degli utenti presenti nel database.

**Funzionamento:** esegue direttamente una query `SELECT * FROM utenti`, 
restituendo tutte le righe tramite `db.all()`.

>[!example] Parametri:
>Restituisce in output l'elenco `rows` di tutti gli utenti nel database

---

#### `getUtentiByRuolo()`

**Firma:** `static async getUtentiByRuolo(ruolo)`

**Scopo:** recupera l'elenco degli utenti che ricoprono un determinato 
ruolo, distinguendo tra utenti/professionisti generici e l'elenco specifico 
dei professionisti.

**Funzionamento:** se `ruolo` è compreso tra `0` e `2`, delega a 
`User.getUtentiByRuolo()`; se `ruolo` è `3`, delega invece a 
`User.getProfessionisti()`. Per qualsiasi altro valore, lancia un errore 
di ruolo non valido. In entrambi i rami validi, restituisce un array vuoto 
se non vengono trovati risultati.

>[!example] Parametri:
>Prende in input il `ruolo` (numerico) di cui recuperare gli utenti
>Restituisce in output l'elenco degli utenti corrispondenti al ruolo, oppure 
>un array vuoto se non ne esistono

---

#### `getAlbo()`

**Firma:** `static async getAlbo()`

**Scopo:** recupera l'albo professionale.

**Funzionamento:** delega a `User.getAlbo()`, restituendo un array vuoto se 
non vengono trovati risultati.

>[!example] Parametri:
>Restituisce in output l'elenco `albo`, oppure un array vuoto se non ne 
>esiste alcuno

---

#### `getRichieste()`

**Firma:** `static async getRichieste()`

**Scopo:** recupera l'elenco generale delle richieste presenti nel sistema.

**Funzionamento:** delega a `User.getRichieste()`, restituendo un array 
vuoto se non vengono trovati risultati.

>[!example] Parametri:
>Restituisce in output l'elenco `richieste`, oppure un array vuoto se non ne 
>esiste alcuna

---

#### `getRuoloProfessionista()`

**Firma:** `static async getRuoloProfessionista(id_professionista)`

**Scopo:** recupera il ruolo/specializzazione di un professionista a partire 
dal suo id.

**Funzionamento:** delega a `User.getRuoloProfessionista()`, restituendo 
`null` se il ruolo non viene trovato.

>[!example] Parametri:
>Prende in input l'`id_professionista` di cui recuperare il ruolo
>Restituisce in output l'oggetto `ruolo`, oppure `null` se non trovato

---

#### `getAssociazioniUtente()` / `getAssociazioniProfessionista()`

**Firma:** `static async getAssociazioniUtente(id_utente)` / `static async getAssociazioniProfessionista(id_professionista)`

**Scopo:** recuperano rispettivamente le associazioni di un utente con i 
professionisti e le associazioni di un professionista con i propri clienti.

**Funzionamento:** delegano ai rispettivi metodi di `User`, restituendo un 
array vuoto se non vengono trovate associazioni.

>[!example] Parametri:
>Prendono in input rispettivamente l'`id_utente` o l'`id_professionista`
>Restituiscono in output l'elenco delle rispettive associazioni, oppure un 
>array vuoto se non ne esistono

---

#### `getRichiesteUtente()` / `getRichiesteProfessionista()`

**Firma:** `static async getRichiesteUtente(id_utente)` / `static async getRichiesteProfessionista(id_professionista)`

**Scopo:** recuperano rispettivamente le richieste inviate da un utente e 
le richieste ricevute da un professionista.

**Funzionamento:** delegano ai rispettivi metodi di `User`, restituendo un 
array vuoto se non vengono trovate richieste.

>[!example] Parametri:
>Prendono in input rispettivamente l'`id_utente` o l'`id_professionista`
>Restituiscono in output l'elenco delle rispettive richieste, oppure un 
>array vuoto se non ne esistono

---

#### `getAssociazioniPending()` / `getRichiestePending()`

**Firma:** `static async getAssociazioniPending(id_utente)` / `static async getRichiestePending(id_utente)`

**Scopo:** recuperano rispettivamente le associazioni e le richieste in 
attesa di approvazione per un determinato utente/professionista.

**Funzionamento:** delegano ai rispettivi metodi di `User`, restituendo un 
array vuoto se non vengono trovati risultati.

>[!example] Parametri:
>Prendono in input l'`id_utente`
>Restituiscono in output l'elenco delle rispettive associazioni/richieste in 
>attesa, oppure un array vuoto se non ne esistono

---

#### `getFeedAssociati()`

**Firma:** `static async getFeedAssociati(id_professionsta)`

**Scopo:** recupera il feed delle attività recenti tracciate dai clienti 
associati a un professionista.

**Funzionamento:** delega a `User.getFeedAssociati()`, restituendo un array 
vuoto se non vengono trovati risultati.

>[!example] Parametri:
>Prende in input l'`id_professionsta` di cui recuperare il feed
>Restituisce in output l'elenco `feed`, oppure un array vuoto se non ne 
>esiste alcuno

---

#### `creaAssociazione()`

**Firma:** `static async creaAssociazione(id_utente, id_persona)`

**Scopo:** crea una nuova associazione tra un utente e un professionista (o 
viceversa).

**Funzionamento:** delega a `User.creaAssociazione()`; se la creazione 
fallisce, lancia un errore esplicito.

>[!example] Parametri:
>Prende in input `id_utente` e `id_persona`
>Restituisce in output l'oggetto `associazione` appena creata

---

#### `accettaAssociazione()`

**Firma:** `static async accettaAssociazione(id_associazione)`

**Scopo:** accetta una richiesta di associazione esistente.

**Funzionamento:** delega a `User.accettaAssociazione()`; se l'operazione 
fallisce, lancia un errore esplicito.

>[!example] Parametri:
>Prende in input l'`id_associazione` da accettare
>Restituisce in output l'oggetto `accettata`

---

#### `creaRichiesta()`

**Firma:** `static async creaRichiesta(id_utente, dati)`

**Scopo:** crea una nuova richiesta di modifica o votazione.

**Funzionamento:** delega a `User.creaRichiesta()`; se la creazione fallisce, 
lancia un errore esplicito.

>[!example] Parametri:
>Prende in input `id_utente` e l'oggetto `dati` della richiesta
>Restituisce in output l'oggetto `creata`

---

#### `accettaRichiesta()`

**Firma:** `static async accettaRichiesta(richiesta)`

**Scopo:** accetta una richiesta di modifica o votazione, aggiornandone lo 
stato in base al tipo.

**Funzionamento:** in base a `richiesta.tipo`, delega a 
`User.accettaRichiesta()` passando lo stato finale corrispondente: 
`'MODIFICATA'` per le richieste di tipo `'MODIFICA'`, `'VOTATA'` per quelle 
di tipo `'VOTO'`. In entrambi i casi, se l'operazione fallisce, lancia un 
errore esplicito.

>[!example] Parametri:
>Prende in input l'oggetto `richiesta`, contenente `id` e `tipo`
>Restituisce in output l'oggetto `accettata`

---

#### `riempiInfo()`

**Firma:** `static async riempiInfo(info)`

**Scopo:** aggiorna le informazioni fisiche di un utente.

**Funzionamento:** delega a `User.riempiInfo()`; se l'operazione fallisce, 
lancia un errore esplicito.

>[!example] Parametri:
>Prende in input l'oggetto `info` con i dati fisici da aggiornare
>Restituisce in output l'oggetto `nuoveInfo`

---

#### `aggiornaPassword()`

**Firma:** `static async aggiornaPassword(id_utente, vecchiaPassword, nuovaPassword)`

**Scopo:** aggiorna la password di un utente, verificando preventivamente 
che la vecchia password fornita sia corretta.

**Funzionamento:**
1. Recupera l'utente tramite `User.findById()`; se non esiste, lancia un 
   errore
2. Verifica la corrispondenza di `vecchiaPassword` con quella salvata, 
   tramite `User.comparePassword()`; se non corrisponde, lancia un errore
3. Se la verifica ha successo, aggiorna la password tramite 
   `User.aggiornaPasswordHash()`

>[!example] Parametri:
>Prende in input `id_utente`, `vecchiaPassword` e `nuovaPassword`
>Restituisce in output il `password` risultante dall'aggiornamento

---

#### `eliminaEta()`

**Firma:** `static async eliminaEta(id_utente)`

**Scopo:** elimina l'informazione relativa all'età di un utente.

**Funzionamento:** delega a `User.eliminaEta()`, restituendo `null` se 
l'operazione non ha effetto.

>[!example] Parametri:
>Prende in input l'`id_utente` di cui eliminare l'età
>Restituisce in output l'oggetto `eliminato`, oppure `null`

---

#### `annullaAssociazione()`

**Firma:** `static async annullaAssociazione(id_associazione)`

**Scopo:** annulla un'associazione esistente o una richiesta pending.

**Funzionamento:** delega a `User.annullaAssociazione()`; se l'operazione 
fallisce, lancia un errore esplicito.

>[!example] Parametri:
>Prende in input l'`id_associazione` da annullare
>Restituisce in output l'oggetto `annullata`

---

#### `annullaRichiesta()`

**Firma:** `static async annullaRichiesta(id_richiesta)`

**Scopo:** annulla/rifiuta una richiesta di modifica o votazione.

**Funzionamento:** delega a `User.annullaRichiesta()`; se l'operazione 
fallisce, lancia un errore esplicito.

>[!example] Parametri:
>Prende in input l'`id_richiesta` da annullare
>Restituisce in output l'oggetto `annullata`




---
---

## ## Bacheca Services

> [!abstract] Descrizione
> Questo servizio gestisce la logica di business relativa alla bacheca 
> condivisa: recupero delle attività condivise (pasti e allenamenti), 
> gestione dei voti e condivisione di nuove attività.

### Metodi implementati

#### `getPastiBacheca()`

**Firma:** `static async getPastiBacheca()`

**Scopo:** recupera i pasti condivisi in bacheca.

**Funzionamento:** delega a `Bacheca.getPastiBacheca()`, restituendo un 
array vuoto se non vengono trovati risultati.

>[!example] Parametri:
>Restituisce in output l'elenco `pasti` condivisi in bacheca, oppure un 
>array vuoto se non ne esistono

---

#### `getAllenamentiBacheca()`

**Firma:** `static async getAllenamentiBacheca()`

**Scopo:** recupera gli allenamenti condivisi in bacheca.

**Funzionamento:** delega a `Bacheca.getAllenamentiBacheca()`, restituendo 
un array vuoto se non vengono trovati risultati.

>[!example] Parametri:
>Restituisce in output l'elenco `allenamenti` condivisi in bacheca, oppure 
>un array vuoto se non ne esistono

---

#### `getSingolaAttivitaBacheca()`

**Firma:** `static async getSingolaAttivitaBacheca(id_utente, id_attivita, tipologia_attivita)`

**Scopo:** verifica se una specifica attività è già stata condivisa in 
bacheca da un determinato utente.

**Funzionamento:** delega a `Bacheca.getSingolaAttivitaBacheca()`, 
restituendo `null` se l'attività non viene trovata.

>[!example] Parametri:
>Prende in input `id_utente`, `id_attivita` e `tipologia_attivita`
>Restituisce in output l'oggetto `attivita`, oppure `null` se non trovata

---

#### `getVotiAttivita()`

**Firma:** `static async getVotiAttivita(id_attivita, tipologia_attivita)`

**Scopo:** recupera l'elenco dei voti ricevuti da una specifica attività.

**Funzionamento:** delega a `Bacheca.getVotiAttivita()`, restituendo un 
array vuoto se non vengono trovati voti.

>[!example] Parametri:
>Prende in input `id_attivita` e `tipologia_attivita`
>Restituisce in output l'elenco `voti`, oppure un array vuoto se non ne 
>esistono

---

#### `condividiAttivita()`

**Firma:** `static async condividiAttivita(id_utente, id_attivita, tipologia_attivita)`

**Scopo:** condivide un'attività (pasto o allenamento) in bacheca.

**Funzionamento:** delega a `Bacheca.condividiAttivita()`; se l'operazione 
fallisce, lancia un errore esplicito.

>[!example] Parametri:
>Prende in input `id_utente`, `id_attivita` e `tipologia_attivita`
>Restituisce in output l'oggetto `condivisa`

---

#### `votaAttivita()`

**Firma:** `static async votaAttivita(id_utente, attivita)`

**Scopo:** invia una valutazione a un'attività condivisa.

**Funzionamento:** delega a `Bacheca.votaAttivita()`.

>[!example] Parametri:
>Prende in input `id_utente` e l'oggetto `attivita`
>Restituisce in output l'oggetto `votata`




---
---


<center><h1> Model </h1></center>

## Pasti Model

> [!abstract] Descrizione
> Questo model interagisce direttamente con il database SQLite per le 
> operazioni CRUD sui pasti, incapsulando le query SQL grezze all'interno 
> di `Promise` che avvolgono le callback native del driver `sqlite3`.

### Metodi implementati

#### `getAllAlimenti()`

**Firma:** `static async getAllAlimenti()`

**Scopo:** recupera tutti gli alimenti presenti nel database.

**Funzionamento:** esegue una query `SELECT * FROM alimenti`, restituendo 
tutte le righe tramite `db.all()`.

>[!example] Parametri:
>Restituisce in output l'elenco `rows` di tutti gli alimenti nel database

---

#### `getAlimentoById()`

**Firma:** `static async getAlimentoById(id_alimento)`

**Scopo:** recupera un singolo alimento a partire dal suo id.

**Funzionamento:** esegue una query `SELECT * FROM alimenti WHERE id = ?`, 
restituendo la singola riga trovata tramite `db.get()`.

>[!example] Parametri:
>Prende in input l'`id_alimento` da cercare
>Restituisce in output la `row` corrispondente all'alimento, oppure 
>`undefined` se non trovato

---

#### `getAllPasti()`

**Firma:** `static async getAllPasti()`

**Scopo:** recupera tutti i pasti presenti nel database.

**Funzionamento:** esegue una query `SELECT * FROM pasti`, restituendo tutte 
le righe tramite `db.all()`.

>[!example] Parametri:
>Restituisce in output l'elenco `rows` di tutti i pasti nel database

---

#### `findPastoById()`

**Firma:** `static async findPastoById(id_pasto)`

**Scopo:** recupera un singolo pasto a partire dal suo id.

**Funzionamento:** esegue una query `SELECT * FROM pasti WHERE id = ?`, 
restituendo la singola riga trovata tramite `db.get()`.

>[!example] Parametri:
>Prende in input l'`id_pasto` da cercare
>Restituisce in output la `row` corrispondente al pasto, oppure `undefined` 
>se non trovato

---

#### `getAllAlimentiPasti()`

**Firma:** `static async getAllAlimentiPasti()`

**Scopo:** recupera tutte le associazioni pasto-alimento presenti nel 
database.

**Funzionamento:** esegue una query `SELECT * FROM alimenti_pasto`, 
restituendo tutte le righe tramite `db.all()`.

>[!example] Parametri:
>Restituisce in output l'elenco `rows` di tutte le associazioni 
>pasto-alimento

---

#### `getDettagliPasto()`

**Firma:** `static async getDettagliPasto(id_pasto, pasto)`

**Scopo:** recupera gli alimenti associati a un pasto, unendoli ai relativi 
dati nutrizionali.

**Funzionamento:** esegue una query con `JOIN` tra `alimenti_pasto` e 
`alimenti` per ottenere, in un'unica interrogazione, sia le quantità 
associate al pasto sia i dati nutrizionali di ciascun alimento. Combina 
infine il risultato con l'oggetto `pasto` ricevuto come parametro, 
componendo un unico oggetto `dettagliPasto` con la proprietà `alimenti`.

>[!example] Parametri:
>Prende in input l'`id_pasto` di cui recuperare gli alimenti e l'oggetto 
>`pasto` già recuperato in precedenza
>Restituisce in output l'oggetto `dettagliPasto`, composto dai dati del 
>pasto e dall'elenco degli `alimenti` associati

---

#### `getPastiUtente()`

**Firma:** `static async getPastiUtente(user_id)`

**Scopo:** recupera tutti i pasti associati a un determinato utente.

**Funzionamento:** esegue una query `SELECT * FROM pasti p WHERE p.user_id = ?`, 
restituendo tutte le righe tramite `db.all()`.

>[!example] Parametri:
>Prende in input lo `user_id` dell'utente
>Restituisce in output l'elenco `rows` dei pasti dell'utente

---

#### `getPastiProgrammati()`

**Firma:** `static async getPastiProgrammati(user_id)`

**Scopo:** recupera i pasti di un utente già programmati nel calendario.

**Funzionamento:** esegue una query con `JOIN` tra `pasti_programmati` e 
`pasti`, selezionando la data di calendario insieme ai dati essenziali del 
pasto, filtrando per l'utente specificato.

>[!example] Parametri:
>Prende in input lo `user_id` dell'utente
>Restituisce in output l'elenco `rows` dei pasti programmati, con la 
>rispettiva `data_calendario`

---

#### `checkPasto()`

**Firma:** `static async checkPasto(user_id, nome, tipo)`

**Scopo:** verifica se esiste già un pasto con lo stesso nome e tipo per un 
determinato utente.

**Funzionamento:** esegue una query `SELECT` filtrata per `user_id`, `nome` 
e `tipo`, restituendo un `boolean` in base alla presenza o meno di righe nel 
risultato.

>[!example] Parametri:
>Prende in input `user_id`, `nome` e `tipo` del pasto da verificare
>Restituisce in output un `boolean` che indica se esiste già un pasto con 
>quei dati

---

#### `creaPasti()`

**Firma:** `static async creaPasti(user_id, nome, tipo, data_creazione)`

**Scopo:** inserisce un nuovo pasto nel database.

**Funzionamento:** esegue una query `INSERT INTO pasti`, restituendo 
`this.lastID`, l'id generato automaticamente dal database per la riga 
appena inserita (proprietà specifica del driver `sqlite3`, accessibile solo 
tramite `function` tradizionale e non con una arrow function, dato che 
richiede il proprio contesto `this`).

>[!example] Parametri:
>Prende in input `user_id`, `nome`, `tipo` e `data_creazione`
>Restituisce in output il `lastID` (`number`) del pasto appena creato

---

#### `riempiPasto()`

**Firma:** `static async riempiPasto(id_pasto, alimenti)`

**Scopo:** inserisce nel database l'elenco degli alimenti associati a un 
pasto.

**Funzionamento:** mappa l'array `alimenti` in un array di `Promise`, 
ciascuna corrispondente a una query `INSERT INTO alimenti_pasto` per il 
singolo alimento. Attende il completamento di tutte le inserzioni tramite 
`Promise.all()`, restituendo infine un oggetto di conferma.

>[!example] Parametri:
>Prende in input l'`id_pasto` e l'array `alimenti` da inserire
>Restituisce in output un oggetto contenente `message`, `id_pasto` e 
>`alimenti`

---

#### `programmaPasto()`

**Firma:** `static async programmaPasto(id_pasto, data_calendario)`

**Scopo:** inserisce nel database la programmazione di un pasto in una data 
del calendario.

**Funzionamento:** esegue una query `INSERT INTO pasti_programmati`, 
restituendo un oggetto di conferma al termine dell'operazione.

>[!example] Parametri:
>Prende in input l'`id_pasto` e la `data_calendario`
>Restituisce in output un oggetto contenente un `message` di conferma

---

#### `disdiciPasto()`

**Firma:** `static async disdiciPasto(id_pasto, data_calendario)`

**Scopo:** rimuove dal database la programmazione di un pasto in una 
specifica data.

**Funzionamento:** esegue una query `DELETE FROM pasti_programmati` filtrata 
per `pasto_id` e `data_calendario`, restituendo un oggetto di conferma.

>[!example] Parametri:
>Prende in input l'`id_pasto` e la `data_calendario` da cui rimuovere la 
>programmazione
>Restituisce in output un oggetto contenente un `message` di conferma

---

#### `eliminaPasto()`

**Firma:** `static async eliminaPasto(id_pasto)`

**Scopo:** elimina definitivamente un pasto e tutti i relativi dettagli dal 
database.

**Funzionamento:** esegue prima una query `DELETE FROM alimenti_pasto` per 
rimuovere gli alimenti associati, quindi, solo al suo completamento, una 
seconda query `DELETE FROM pasti` per rimuovere il pasto stesso. Verifica 
tramite `this.changes` se effettivamente è stata eliminata una riga, 
restituendo un messaggio differente in caso il pasto non fosse stato trovato.

>[!example] Parametri:
>Prende in input l'`id_pasto` da eliminare
>Restituisce in output un oggetto contenente un `message` che conferma 
>l'eliminazione o segnala che nessun pasto è stato trovato

---

#### `eliminaDettagliPasto()`

**Firma:** `static async eliminaDettagliPasto(id_pasto)`

**Scopo:** elimina solamente gli alimenti associati a un pasto, senza 
eliminare il pasto stesso.

**Funzionamento:** esegue una query `DELETE FROM alimenti_pasto` filtrata 
per `pasto_id`, restituendo un oggetto di conferma. Utilizzato da 
`PastiServices.modificaPasto()` come primo passo dell'approccio 
"elimina e ricrea" per la modifica degli alimenti di un pasto.

>[!example] Parametri:
>Prende in input l'`id_pasto` di cui eliminare i dettagli
>Restituisce in output un oggetto contenente un `message` di conferma




---
---

## Allenamenti Model

> [!abstract] Descrizione
> Questo model interagisce direttamente con il database SQLite per le 
> operazioni CRUD sugli allenamenti, incapsulando le query SQL grezze 
> all'interno di `Promise` che avvolgono le callback native del driver 
> `sqlite3`. La struttura è speculare a quella del `Pasti` model.

### Metodi implementati

#### `getAllEsercizi()`

**Firma:** `static async getAllEsercizi()`

**Scopo:** recupera tutti gli esercizi presenti nel database.

**Funzionamento:** esegue una query `SELECT * FROM esercizi`, restituendo 
tutte le righe tramite `db.all()`.

>[!example] Parametri:
>Restituisce in output l'elenco `rows` di tutti gli esercizi nel database

---

#### `getEsercizioById()`

**Firma:** `static async getEsercizioById(id_esercizio)`

**Scopo:** recupera un singolo esercizio a partire dal suo id.

**Funzionamento:** esegue una query `SELECT * FROM esercizi WHERE id = ?`, 
restituendo la singola riga trovata tramite `db.get()`.

>[!example] Parametri:
>Prende in input l'`id_esercizio` da cercare
>Restituisce in output la `row` corrispondente all'esercizio, oppure 
>`undefined` se non trovato

---

#### `getAllAllenamenti()`

**Firma:** `static async getAllAllenamenti()`

**Scopo:** recupera tutti gli allenamenti presenti nel database.

**Funzionamento:** esegue una query `SELECT * FROM allenamenti`, restituendo 
tutte le righe tramite `db.all()`.

>[!example] Parametri:
>Restituisce in output l'elenco `rows` di tutti gli allenamenti nel database

---

#### `findAllenamentoById()`

**Firma:** `static async findAllenamentoById(id_allenamento)`

**Scopo:** recupera un singolo allenamento a partire dal suo id.

**Funzionamento:** esegue una query `SELECT * FROM allenamenti WHERE id = ?`, 
restituendo la singola riga trovata tramite `db.get()`.

>[!example] Parametri:
>Prende in input l'`id_allenamento` da cercare
>Restituisce in output la `row` corrispondente all'allenamento, oppure 
>`undefined` se non trovato

---

#### `getAllEserciziAllenamento()`

**Firma:** `static async getAllEserciziAllenamento()`

**Scopo:** recupera tutte le associazioni allenamento-esercizio presenti nel 
database.

**Funzionamento:** esegue una query `SELECT * FROM esercizi_allenamento`, 
restituendo tutte le righe tramite `db.all()`.

>[!example] Parametri:
>Restituisce in output l'elenco `rows` di tutte le associazioni 
>allenamento-esercizio

---

#### `getDettagliAllenamento()`

**Firma:** `static async getDettagliAllenamento(id_allenamento, allenamento)`

**Scopo:** recupera gli esercizi associati a un allenamento, unendoli ai 
relativi dati.

**Funzionamento:** esegue una query con `JOIN` tra `esercizi_allenamento` e 
`esercizi` per ottenere, in un'unica interrogazione, sia i parametri 
associati all'allenamento (serie, ripetizioni, ecc.) sia i dati di ciascun 
esercizio. Combina infine il risultato con l'oggetto `allenamento` ricevuto 
come parametro, componendo un unico oggetto `dettagliAllenamento` con la 
proprietà `esercizi`.

>[!example] Parametri:
>Prende in input l'`id_allenamento` di cui recuperare gli esercizi e 
>l'oggetto `allenamento` già recuperato in precedenza
>Restituisce in output l'oggetto `dettagliAllenamento`, composto dai dati 
>dell'allenamento e dall'elenco degli `esercizi` associati

---

#### `getAllenamentiUtente()`

**Firma:** `static async getAllenamentiUtente(user_id)`

**Scopo:** recupera tutti gli allenamenti associati a un determinato utente, 
ordinati per data.

**Funzionamento:** esegue una query `SELECT * FROM allenamenti a WHERE a.user_id = ? ORDER BY data`, 
restituendo tutte le righe tramite `db.all()`.

>[!example] Parametri:
>Prende in input lo `user_id` dell'utente
>Restituisce in output l'elenco `rows` degli allenamenti dell'utente, 
>ordinati per data

---

#### `checkAllenamento()`

**Firma:** `static async checkAllenamento(user_id, giorno)`

**Scopo:** verifica se esiste già un allenamento programmato per un 
determinato giorno per un determinato utente.

**Funzionamento:** esegue una query `SELECT` filtrata per `user_id` e `data`, 
restituendo un `boolean` in base alla presenza o meno di righe nel risultato.

>[!example] Parametri:
>Prende in input `user_id` e `giorno`
>Restituisce in output un `boolean` che indica se esiste già un allenamento 
>in quella data

---

#### `creaAllenamenti()`

**Firma:** `static async creaAllenamenti(user_id, nome, giorno, durata, data_creazione)`

**Scopo:** inserisce un nuovo allenamento nel database.

**Funzionamento:** esegue una query `INSERT INTO allenamenti`, restituendo 
`this.lastID`, l'id generato automaticamente dal database per la riga 
appena inserita.

>[!example] Parametri:
>Prende in input `user_id`, `nome`, `giorno`, `durata` e `data_creazione`
>Restituisce in output il `lastID` (`number`) dell'allenamento appena creato

---

#### `riempiAllenamento()`

**Firma:** `static async riempiAllenamento(id_allenamento, esercizi)`

**Scopo:** inserisce nel database l'elenco degli esercizi associati a un 
allenamento.

**Funzionamento:** mappa l'array `esercizi` in un array di `Promise`, 
ciascuna corrispondente a una query `INSERT INTO esercizi_allenamento` per 
il singolo esercizio (con serie, ripetizioni, pesi e riposo). Attende il 
completamento di tutte le inserzioni tramite `Promise.all()`, restituendo 
infine un oggetto di conferma.

>[!example] Parametri:
>Prende in input l'`id_allenamento` e l'array `esercizi` da inserire
>Restituisce in output un oggetto contenente `message`, `id_allenamento` e 
>`esercizi`

---

#### `programmaAllenamento()`

**Firma:** `static async programmaAllenamento(id_allenamento, data_calendario)`

**Scopo:** aggiorna la data di un allenamento esistente, programmandolo in 
una nuova data del calendario.

**Funzionamento:** esegue una query `UPDATE allenamenti SET data = ? WHERE id = ?`, 
restituendo `this.lastID` al termine dell'operazione.

>[!example] Parametri:
>Prende in input l'`id_allenamento` e la `data_calendario`
>Restituisce in output il `lastID` (`number`) restituito dall'operazione di 
>update

---

#### `eliminaAllenamento()`

**Firma:** `static async eliminaAllenamento(id_allenamento)`

**Scopo:** elimina definitivamente un allenamento e tutti i relativi 
dettagli dal database.

**Funzionamento:** esegue prima una query `DELETE FROM esercizi_allenamento` 
per rimuovere gli esercizi associati, quindi, solo al suo completamento, una 
seconda query `DELETE FROM allenamenti` per rimuovere l'allenamento stesso. 
Verifica tramite `this.changes` se effettivamente è stata eliminata una 
riga, restituendo un messaggio differente in caso l'allenamento non fosse 
stato trovato.

>[!example] Parametri:
>Prende in input l'`id_allenamento` da eliminare
>Restituisce in output un oggetto contenente un `message` che conferma 
>l'eliminazione o segnala che nessun allenamento è stato trovato

---

#### `eliminaDettagliAllenamento()`

**Firma:** `static async eliminaDettagliAllenamento(id_allenamento)`

**Scopo:** elimina solamente gli esercizi associati a un allenamento, senza 
eliminare l'allenamento stesso.

**Funzionamento:** esegue una query `DELETE FROM esercizi_allenamento` 
filtrata per `allenamento_id`, restituendo un oggetto di conferma. Utilizzato 
da `AllenamentiServices.modificaAllenamento()` come primo passo 
dell'approccio "elimina e ricrea" per la modifica degli esercizi di un 
allenamento.

>[!example] Parametri:
>Prende in input l'`id_allenamento` di cui eliminare i dettagli
>Restituisce in output un oggetto contenente un `message` di conferma



---
---

## User Model

> [!abstract] Descrizione
> Questo model interagisce direttamente con il database SQLite per le 
> operazioni CRUD sugli utenti: creazione, ricerca, gestione password 
> tramite hashing con `bcryptjs`, associazioni tra utenti e professionisti, 
> richieste di modifica/voto e informazioni fisiche del profilo.

### Metodi implementati

#### `create()`

**Firma:** `static async create({ nome, cognome, email, password, ruolo })`

**Scopo:** crea un nuovo utente nel database, con password sottoposta a 
hashing.

**Funzionamento:** genera un salt tramite `bcrypt.genSalt(10)` e calcola 
l'hash della password con `bcrypt.hash()`. Esegue quindi una query 
`INSERT INTO utenti`, recuperando l'id generato tramite una seconda query 
`SELECT last_insert_rowid()`.

>[!example] Parametri:
>Prende in input un oggetto con `nome`, `cognome`, `email`, `password` e 
>`ruolo`
>Restituisce in output un oggetto contenente `id`, `nome`, `cognome`, 
>`email` e `ruolo` dell'utente appena creato

---

#### `findByEmail()`

**Firma:** `static async findByEmail(email)`

**Scopo:** cerca un utente a partire dalla sua email.

**Funzionamento:** esegue una query `SELECT * FROM utenti WHERE email = ?`, 
restituendo la singola riga trovata tramite `db.get()`.

>[!example] Parametri:
>Prende in input l'`email` da cercare
>Restituisce in output la `row` corrispondente all'utente, oppure 
>`undefined` se non trovato

---

#### `findById()`

**Firma:** `static async findById(id_utente)`

**Scopo:** cerca un utente a partire dal suo id.

**Funzionamento:** esegue una query `SELECT` mirata sui campi essenziali 
(id, nome, cognome, email, password, ruolo), restituendo la singola riga 
trovata tramite `db.get()`.

>[!example] Parametri:
>Prende in input l'`id_utente` da cercare
>Restituisce in output la `row` corrispondente all'utente, oppure 
>`undefined` se non trovato

---

#### `findInfo()`

**Firma:** `static async findInfo(id_utente)`

**Scopo:** recupera le informazioni fisiche e le associazioni con eventuali 
professionisti dal profilo di un utente.

**Funzionamento:** esegue una query sulla tabella `profilo_utente`, 
restituendo la singola riga trovata tramite `db.get()`.

>[!example] Parametri:
>Prende in input l'`id_utente` di cui recuperare le informazioni
>Restituisce in output la `row` corrispondente al profilo, oppure 
>`undefined` se non trovata

---

#### `getUtentiByRuolo()`

**Firma:** `static async getUtentiByRuolo(ruolo)`

**Scopo:** recupera gli utenti che ricoprono un determinato ruolo.

**Funzionamento:** esegue una query `SELECT` filtrata per `ruolo`, tramite 
`db.get()`.

>[!example] Parametri:
>Prende in input il `ruolo` da cercare
>Restituisce in output la `row` (o le `rows`) corrispondenti

> [!note] Uso di `db.get()` invece di `db.all()`
> A differenza degli altri metodi che recuperano più righe (es. `getAlbo()`, 
> `getRichieste()`), questo metodo utilizza `db.get()`, che per il driver 
> `sqlite3` restituisce solo la **prima** riga corrispondente, non l'intero 
> insieme di utenti con quel ruolo.

---

#### `getAlbo()`

**Firma:** `static async getAlbo()`

**Scopo:** recupera l'albo professionale completo.

**Funzionamento:** esegue una query `SELECT * FROM albo_professionisti`, 
restituendo tutte le righe tramite `db.all()`.

>[!example] Parametri:
>Restituisce in output l'elenco `rows` dell'albo professionisti

---

#### `getRichieste()`

**Firma:** `static async getRichieste()`

**Scopo:** recupera l'elenco generale di tutte le richieste presenti nel 
sistema.

**Funzionamento:** esegue una query `SELECT * FROM richieste`, restituendo 
tutte le righe tramite `db.all()`.

>[!example] Parametri:
>Restituisce in output l'elenco `rows` di tutte le richieste

---

#### `getProfessionisti()`

**Firma:** `static async getProfessionisti()`

**Scopo:** recupera l'elenco dei professionisti, arricchito con la relativa 
specializzazione.

**Funzionamento:** esegue una query con doppio `JOIN` tra `utenti`, 
`albo_professionisti` e `ruoli_professionisti`, filtrando solo gli utenti 
con `ruolo > 0`.

>[!example] Parametri:
>Restituisce in output l'elenco `rows` dei professionisti, con la relativa 
>`professione`

---

#### `getRuoliProfessionisti()`

**Firma:** `static async getRuoliProfessionisti()`

**Scopo:** recupera l'elenco delle specializzazioni professionali disponibili.

**Funzionamento:** esegue una query `SELECT * FROM ruoli_professionisti`, 
restituendo tutte le righe tramite `db.all()`.

>[!example] Parametri:
>Restituisce in output l'elenco `rows` delle specializzazioni disponibili

---

#### `getRuoloProfessionista()`

**Firma:** `static async getRuoloProfessionista(id_professionista)`

**Scopo:** recupera il ruolo/specializzazione di un professionista a partire 
dal suo id.

**Funzionamento:** esegue una query con `JOIN` tra `albo_professionisti` e 
`ruoli_professionisti`, restituendo la singola riga trovata tramite 
`db.get()`.

>[!example] Parametri:
>Prende in input l'`id_professionista` di cui recuperare il ruolo
>Restituisce in output la `row` contenente il `ruolo`, oppure `undefined` 
>se non trovato

---

#### `getAssociazioniUtente()`

**Firma:** `static async getAssociazioniUtente(id_utente)`

**Scopo:** recupera le associazioni di un utente con i professionisti a lui 
associati.

**Funzionamento:** esegue una query con `JOIN` tra `associazioni` e 
`utenti`, filtrando per `id_paziente`, restituendo tutte le righe tramite 
`db.all()`.

>[!example] Parametri:
>Prende in input l'`id_utente` di cui recuperare le associazioni
>Restituisce in output l'elenco `rows` delle associazioni, con i dati del 
>professionista associato

---

#### `getAssociazioniProfessionista()`

**Firma:** `static async getAssociazioniProfessionista(id_professionista)`

**Scopo:** recupera le associazioni di un professionista con i propri 
clienti.

**Funzionamento:** esegue una query con `JOIN` tra `associazioni` e 
`utenti`, filtrando per `id_professionista`, restituendo tutte le righe 
tramite `db.all()`.

>[!example] Parametri:
>Prende in input l'`id_professionista` di cui recuperare le associazioni
>Restituisce in output l'elenco `rows` delle associazioni, con i dati del 
>cliente associato

---

#### `getRichiesteUtente()`

**Firma:** `static async getRichiesteUtente(id_utente)`

**Scopo:** recupera le richieste inviate da un utente ai professionisti.

**Funzionamento:** esegue una query con `JOIN` tra `richieste` e `utenti`, 
filtrando per `id_paziente`, restituendo tutte le righe tramite `db.all()`.

>[!example] Parametri:
>Prende in input l'`id_utente` di cui recuperare le richieste
>Restituisce in output l'elenco `rows` delle richieste inviate

---

#### `getRichiesteProfessionista()`

**Firma:** `static async getRichiesteProfessionista(id_professionista)`

**Scopo:** recupera le richieste ricevute da un professionista.

**Funzionamento:** esegue una query con `JOIN` tra `richieste` e `utenti`, 
filtrando per `id_professionista`, restituendo tutte le righe tramite 
`db.all()`.

>[!example] Parametri:
>Prende in input l'`id_professionista` di cui recuperare le richieste
>Restituisce in output l'elenco `rows` delle richieste ricevute

---

#### `getAssociazioniPending()`

**Firma:** `static async getAssociazioniPending(id_professionista)`

**Scopo:** recupera le associazioni in attesa di approvazione per un 
professionista.

**Funzionamento:** esegue una query con `JOIN` tra `associazioni` e 
`utenti`, filtrando per `id_professionista` e stato `"PENDING"`.

>[!example] Parametri:
>Prende in input l'`id_professionista`
>Restituisce in output l'elenco `rows` delle associazioni pending

---

#### `getRichiestePending()`

**Firma:** `static async getRichiestePending(id_professionista)`

**Scopo:** recupera le richieste in attesa di approvazione per un 
professionista.

**Funzionamento:** esegue una query `SELECT` filtrata per `id_professionista` 
e stato `"PENDING"`.

>[!example] Parametri:
>Prende in input l'`id_professionista`
>Restituisce in output l'elenco `rows` delle richieste pending

---

#### `getFeedAssociati()`

**Firma:** `static async getFeedAssociati(id_professionsita)`

**Scopo:** recupera il feed delle ultime attività (pasti e allenamenti) 
tracciate dai clienti associati a un professionista.

**Funzionamento:** esegue una query `UNION ALL` che combina i pasti e gli 
allenamenti recenti dei clienti associati e accettati, ordinando il 
risultato complessivo per data di creazione decrescente e limitando 
l'output alle 10 attività più recenti (`LIMIT 10`).

>[!example] Parametri:
>Prende in input l'`id_professionsita`
>Restituisce in output l'elenco `rows` delle ultime 10 attività, con 
>tipologia, nome attività, data di creazione e dati del cliente

---

#### `iscriviProfessionista()`

**Firma:** `static async iscriviProfessionista(id_professionista, id_ruolo)`

**Scopo:** associa un professionista a una specializzazione, in fase di 
registrazione.

**Funzionamento:** esegue una query `INSERT INTO albo_professionisti`, 
restituendo `this.lastID`.

>[!example] Parametri:
>Prende in input `id_professionista` e `id_ruolo`
>Restituisce in output il `lastID` (`number`) della nuova voce inserita

---

#### `creaAssociazione()`

**Firma:** `static async creaAssociazione(id_utente, id_persona)`

**Scopo:** crea una nuova associazione tra un utente e un professionista.

**Funzionamento:** esegue una query `INSERT INTO associazioni`, restituendo 
un oggetto con `lastID`.

>[!example] Parametri:
>Prende in input `id_utente` e `id_persona`
>Restituisce in output un oggetto contenente il `lastID` (`number`) della 
>nuova associazione

---

#### `accettaAssociazione()`

**Firma:** `static async accettaAssociazione(id_associazione)`

**Scopo:** aggiorna lo stato di un'associazione ad "ACCETTATA".

**Funzionamento:** esegue una query `UPDATE associazioni SET stato = "ACCETTATA"`, 
restituendo un oggetto con `lastID`.

>[!example] Parametri:
>Prende in input l'`id_associazione` da accettare
>Restituisce in output un oggetto contenente il `lastID` (`number`)

---

#### `creaRichiesta()`

**Firma:** `static async creaRichiesta(id_utente, dati)`

**Scopo:** crea una nuova richiesta di modifica o votazione.

**Funzionamento:** esegue una query `INSERT INTO richieste`, restituendo un 
oggetto con `lastID`.

>[!example] Parametri:
>Prende in input `id_utente` e l'oggetto `dati` (contenente id 
>professionista, id attività, tipologia e tipo richiesta)
>Restituisce in output un oggetto contenente il `lastID` (`number`) della 
>nuova richiesta

---

#### `accettaRichiesta()`

**Firma:** `static async accettaRichiesta(id_richiesta, tipo_richiesta)`

**Scopo:** aggiorna lo stato di una richiesta al valore fornito.

**Funzionamento:** esegue una query `UPDATE richieste SET stato = ?`, 
restituendo un oggetto con `lastID`.

>[!example] Parametri:
>Prende in input `id_richiesta` e il nuovo `tipo_richiesta` (stato) da 
>impostare
>Restituisce in output un oggetto contenente il `lastID` (`number`)

---

#### `comparePassword()`

**Firma:** `static async comparePassword(candidatePassword, hash)`

**Scopo:** verifica se una password in chiaro corrisponde a un hash salvato.

**Funzionamento:** delega direttamente a `bcrypt.compare()`.

>[!example] Parametri:
>Prende in input `candidatePassword` (password in chiaro) e `hash` (hash 
>salvato nel database)
>Restituisce in output un `boolean` che indica se la password corrisponde

---

#### `riempiInfo()`

**Firma:** `static async riempiInfo(info)`

**Scopo:** inserisce o aggiorna le informazioni fisiche di un utente nel 
profilo, in base alla loro presenza pregressa.

**Funzionamento:** verifica se esiste già una riga nella tabella 
`profilo_utente` per l'utente specificato; se esiste, esegue una query 
`UPDATE`, altrimenti una query `INSERT`.

>[!example] Parametri:
>Prende in input l'oggetto `info`, contenente `id_utente`, `eta`, 
>`altezza_cm`, `peso_kg` e `condizioni_mediche`
>Restituisce in output un oggetto contenente `success` (`boolean`) e 
>`action` (`string`, `'update'` o `'insert'`)

---

#### `aggiornaEta()`

**Firma:** `static async aggiornaEta(id_utente, eta)`

**Scopo:** aggiorna esclusivamente il campo età nel profilo di un utente.

**Funzionamento:** esegue una query `UPDATE profilo_utente SET eta = ?`, 
restituendo un oggetto con `lastID`.

>[!example] Parametri:
>Prende in input `id_utente` e la nuova `eta`
>Restituisce in output un oggetto contenente il `lastID` (`number`)

---

#### `aggiornaPasswordHash()`

**Firma:** `static async aggiornaPasswordHash(id_utente, nuovaPassword)`

**Scopo:** aggiorna la password di un utente, sottoponendola a hashing prima 
del salvataggio.

**Funzionamento:** genera un nuovo salt e calcola l'hash della nuova 
password tramite `bcrypt`, quindi esegue una query 
`UPDATE utenti SET password = ?`.

>[!example] Parametri:
>Prende in input `id_utente` e la `nuovaPassword` (in chiaro)
>Restituisce in output un oggetto contenente il `lastID` (`number`)

---

#### `annullaAssociazione()`

**Firma:** `static async annullaAssociazione(id_associazione)`

**Scopo:** elimina un'associazione dal database.

**Funzionamento:** esegue una query `DELETE FROM associazioni`, restituendo 
un oggetto con `lastID`.

>[!example] Parametri:
>Prende in input l'`id_associazione` da eliminare
>Restituisce in output un oggetto contenente il `lastID` (`number`)

---

#### `annullaRichiesta()`

**Firma:** `static async annullaRichiesta(id_richiesta)`

**Scopo:** elimina una richiesta dal database.

**Funzionamento:** esegue una query `DELETE FROM richieste`, restituendo un 
oggetto con `lastID`.

>[!example] Parametri:
>Prende in input l'`id_richiesta` da eliminare
>Restituisce in output un oggetto contenente il `lastID` (`number`)


---
---

## Bacheca Model

> [!abstract] Descrizione
> Questo model interagisce direttamente con il database SQLite per le 
> operazioni CRUD relative alla bacheca condivisa: recupero delle attività 
> condivise (pasti e allenamenti), verifica di condivisioni esistenti, 
> gestione dei voti e inserimento di nuove condivisioni.

### Metodi implementati

#### `getPastiBacheca()`

**Firma:** `static async getPastiBacheca()`

**Scopo:** recupera i pasti condivisi in bacheca nelle ultime 24 ore.

**Funzionamento:** esegue una query con doppio `JOIN` tra `bacheca`, `pasti` 
e `utenti`, filtrando per `tipologia_attivita = 0` (pasto) e per data di 
condivisione non anteriore a un giorno fa (`datetime('now', '-1 day')`), 
restituendo tutte le righe tramite `db.all()`.

>[!example] Parametri:
>Restituisce in output l'elenco `rows` dei pasti condivisi nelle ultime 24 ore

---

#### `getAllenamentiBacheca()`

**Firma:** `static async getAllenamentiBacheca()`

**Scopo:** recupera gli allenamenti condivisi in bacheca nelle ultime 24 ore.

**Funzionamento:** esegue una query con doppio `JOIN` tra `bacheca`, 
`allenamenti` e `utenti`, filtrando per `tipologia_attivita = 1` 
(allenamento) e per data di condivisione non anteriore a un giorno fa, 
restituendo tutte le righe tramite `db.all()`.

>[!example] Parametri:
>Restituisce in output l'elenco `rows` degli allenamenti condivisi nelle 
>ultime 24 ore

---

#### `getSingolaAttivitaBacheca()`

**Firma:** `static async getSingolaAttivitaBacheca(id_utente, id_attivita, tipologia_attivita)`

**Scopo:** verifica se una specifica attività è già stata condivisa in 
bacheca da un determinato utente.

**Funzionamento:** esegue una query `SELECT` filtrata per 
`id_utente_condivisore`, `id_attivita` e `tipologia_attivita`, restituendo 
la singola riga trovata tramite `db.get()`.

>[!example] Parametri:
>Prende in input `id_utente`, `id_attivita` e `tipologia_attivita`
>Restituisce in output la `row` corrispondente, oppure `undefined` se 
>l'attività non è stata condivisa

---

#### `getVotiAttivita()`

**Firma:** `static async getVotiAttivita(id_attivita, tipologia_attivita)`

**Scopo:** recupera tutti i voti ricevuti da una specifica attività.

**Funzionamento:** esegue una query `SELECT voto FROM voti` filtrata per 
`id_attivita` e `tipologia_attivita`, restituendo tutte le righe tramite 
`db.all()`.

>[!example] Parametri:
>Prende in input `id_attivita` e `tipologia_attivita`
>Restituisce in output l'elenco `rows` dei voti ricevuti

---

#### `condividiAttivita()`

**Firma:** `static async condividiAttivita(id_utente, id_attivita, tipologia_attivita)`

**Scopo:** inserisce nel database una nuova condivisione di attività in 
bacheca.

**Funzionamento:** esegue una query `INSERT INTO bacheca`, restituendo un 
oggetto con `lastID`.

>[!example] Parametri:
>Prende in input `id_utente`, `id_attivita` e `tipologia_attivita`
>Restituisce in output un oggetto contenente il `lastID` (`number`) della 
>nuova condivisione

---

#### `votaAttivita()`

**Firma:** `static async votaAttivita(id_utente, attivita)`

**Scopo:** inserisce nel database un nuovo voto assegnato a un'attività.

**Funzionamento:** esegue una query `INSERT INTO voti`, restituendo un 
oggetto con `lastID`.

>[!example] Parametri:
>Prende in input `id_utente` e l'oggetto `attivita` (contenente `id`, 
>`tipologia` e `valutazione`)
>Restituisce in output un oggetto contenente il `lastID` (`number`) del 
>nuovo voto




---
---


<center><h1> Validators </h1></center>

## Auth Validators

> [!abstract] Descrizione
> Questo modulo definisce le regole di validazione, tramite `express-validator`, 
> applicate ai dati in ingresso per gli endpoint di registrazione e login, 
> insieme a un middleware condiviso che raccoglie ed espone eventuali errori 
> di validazione riscontrati.

### Elementi implementati

#### `registerValidator`

**Scopo:** verifica che i campi necessari alla registrazione siano 
correttamente valorizzati prima che la richiesta raggiunga il controller.

**Funzionamento:** è un array di regole di validazione, applicate in 
sequenza al corpo della richiesta: `ruolo`, `nome` e `cognome` devono 
essere non vuoti, `email` deve rispettare il formato di un indirizzo email 
valido, `password` deve avere una lunghezza minima di 8 caratteri. Ogni 
regola è associata a un messaggio di errore specifico, restituito in caso 
di fallimento.

---

#### `loginValidator`

**Scopo:** verifica che i campi necessari al login siano correttamente 
valorizzati prima che la richiesta raggiunga il controller.

**Funzionamento:** è un array di regole di validazione: `email` deve 
rispettare il formato di un indirizzo email valido, `password` deve essere 
non vuota.

---

#### `validate`

**Firma:** `validate(req, res, next)`

**Scopo:** middleware che raccoglie gli errori generati dai validatori 
precedenti nella catena e interrompe la richiesta se presenti.

**Funzionamento:** invoca `validationResult(req)` per raccogliere gli errori 
accumulati dai validatori applicati in precedenza (es. `registerValidator` 
o `loginValidator`). Se sono presenti errori, restituisce una risposta con 
status `400` e l'elenco degli errori; altrimenti, chiama `next()` per 
proseguire verso il controller successivo nella catena di middleware.

>[!example] Parametri:
>Prende in input `req`, `res` e `next`, gli oggetti standard di Express per 
>la gestione dei middleware



---
---




<center><h1> Diagrammi </h1></center>

# Diagramma E-R (Entità-Relazione)
Per maggiore chiarezza sull'idea alla base dell'applicazione, ecco un diagramma entità - relazione che illustra i concetti fondamentali dell'Applicazione.

![[DiagrammaE-R 1.jpeg]]

___
___
## Schema Relazione Database
Lo schema mostra che relazione hanno le tabelle nel database e quali attributi contengono



![[DiagrammaDB.jpeg]]