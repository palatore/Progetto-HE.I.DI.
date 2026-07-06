import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GestioneAllenamentiService } from "src/app/services/allenamenti/gestione-allenamenti.service";
import { IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonList, IonLabel, IonItem, IonIcon, IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonButtons, IonMenuButton, AlertController, IonModal } from "@ionic/angular/standalone";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { ModificaDettagliComponent } from "src/app/components/modifica-dettagli/modifica-dettagli.component";
import { firstValueFrom } from "rxjs/internal/firstValueFrom";
import { Allenamento } from "src/app/models/allenamento.model";
import { GestioneUtentiService } from "src/app/services/utenti/gestione-utenti.service";
import { Subject, takeUntil } from "rxjs";
import { DefaultHeaderComponent } from "src/app/components/default-header/default-header.component";

@Component({
    selector: 'app-allenamenti-utente',
    templateUrl: './allenamenti-utente.page.html',
    styleUrls: ['./allenamenti-utente.page.scss'],
    standalone: true,
    imports: [IonModal, IonCardContent, IonCardHeader, IonCardTitle, IonCard, IonIcon, IonItem, IonLabel, IonList, IonContent, IonButton, IonButtons, IonMenuButton, IonTitle, IonHeader, IonToolbar, RouterModule, CommonModule, ModificaDettagliComponent, DefaultHeaderComponent ]
})
export class AllenamentiUtentePage implements OnInit{

    //VARIABILI LATO UTENTE
    public professionisti_disponibili:any[] = [];
    public id_allenamento_richiesta!:number;

    //VARIABILI LATO PROFESSIONISTA
    public professionista_modifica:boolean = false;
    public professionista_vota:boolean = false;

    //VARIABILI CONDIVISE
    public viewModifica:boolean = false;
    public esercizi:any[] = [];
    public allenamentoSelezionato: any = null;
    public allenamento_da_modificare: any = null;
    public esercizioSelezionato:any = null;
    public dettagliAllenamento: any = null; // Variabile per i dettagli dell'allenamento selezionato
    public destroy$ = new Subject<void>;

    constructor(private workoutService:GestioneAllenamentiService, private route:ActivatedRoute, private alertController: AlertController, private userService:GestioneUtentiService){ }

    ngOnInit(){
        this.loadEsercizi();
    }

    ionViewWillEnter(){
        const id_allenamentoString = this.route.snapshot.queryParamMap.get('pasto_id');
        const id_allenamento:number = +id_allenamentoString!;
        const tipo_richiesta = this.route.snapshot.queryParamMap.get('tipo_richiesta');
        if(id_allenamento && tipo_richiesta === 'MODIFICA') {
        //logica professionista modifica
        this.professionista_modifica = true;
        console.log('Professionista in visita per modifica del pasto:', id_allenamentoString);
        this.loadSingoloAllenamento(id_allenamento);
        } else if(id_allenamentoString && tipo_richiesta === 'VOTA') {
        //logica professionista vota
        this.professionista_vota = true;
        console.log('Professionista in visita per votazione del pasto:', id_allenamentoString);
        this.loadSingoloAllenamento(id_allenamento);
        } else {
        this.loadAllenamentiUtente();
        }
    }

    ionViewWillLeave() {
    this.professionista_modifica = false;
    this.professionista_vota = false;
    this.destroy$.next();
  }

    async mostraDettagli(allenamento: any) {
        this.allenamentoSelezionato = allenamento;
        this.dettagliAllenamento = null; // Resetta i dettagli dell'allenamento selezionato
        //Effettua una chiamata al servizio per ottenere i dettagli dell'allenamento selezionato
        try {
            this.dettagliAllenamento = await firstValueFrom(this.workoutService.getDettagliAllenamento(allenamento.id));
            console.log('Dettagli dell\'allenamento:', this.dettagliAllenamento);
        } catch (error) {
            console.error('Errore nel caricamento dei dettagli dell\'allenamento:', error);
        }
    }

    allenamentoTrack(index: number, allenamento: any):string {
        return `${allenamento.name}-${allenamento.data}-${allenamento.data_creazione}`;
    }

    esercizioTrack(index: number, esercizio: any):string {
        return `${esercizio.name} - ${esercizio.serie} - ${esercizio.ripetizioni} - ${esercizio.pesi_kg} - ${esercizio.riposo_minuti}`;
    }

    async getEsercizio(id_esercizio:number){
        console.log('Ricevuto id da cercare:', id_esercizio);
        this.esercizioSelezionato = await this.datiEsercizio(id_esercizio);
    }

    async datiEsercizio(id_esercizio:number): Promise<any> {
        try {
            const response = await firstValueFrom(this.workoutService.getEsercizioById(id_esercizio));
            if(response) {
                console.log('trovato:', response);
                return response;
            }
        } catch (error:any) {
            if(error instanceof Error) {
                console.error(error.message);
                return;
            }else if(error.status == 404){
                console.log('Esercizio non trovato per id:', id_esercizio);
                this.esercizioSelezionato = null;
            }
        }    
    }

    chiudiDettagli() {
        this.allenamentoSelezionato = null;
    }

    async modificaAllenamento(allenamento: any) {
        try {
            this.dettagliAllenamento = await firstValueFrom(this.workoutService.getDettagliAllenamento(allenamento.id));
            console.log('Dettagli dell\'allenamento da modificare:', this.dettagliAllenamento);
        } catch (err){
            console.log(err);
        }
        this.allenamento_da_modificare = allenamento;
        console.log('Allenamento da modificare:', this.allenamento_da_modificare);
        this.viewModifica = true;
    }

    async confermaModificaAllenamento(modifiche: any[]) {
        try {
            const id_allenamento_modificato = this.allenamento_da_modificare.id;
            const response = await firstValueFrom(this.workoutService.modificaAllenamento(id_allenamento_modificato, modifiche));
            console.log('Allenamento modificato con successo:', response);
            //Ricarica gli allenamenti dopo la modifica
            this.loadAllenamentiUtente();
        } catch (e) {
            console.error('Errore nella modifica dell\'allenamento:', e);
        }
    }

    apriRichiesta(id_allenamento:number) {
    this.id_allenamento_richiesta = id_allenamento;

    this.userService.getAssociazioniUtente().subscribe({
      next: (data) => {
        this.professionisti_disponibili = data.filter(professionista => professionista.ruolo === 2);
      },
      error: (err) => console.log(err)
    });
  }

  async inviaRichiesta(id_prof:number, tipo:string) {
    const pacchetto = {
      id_professionista: id_prof,
      id_attivita: this.id_allenamento_richiesta,
      tipologia_attivita: 1,
      tipo_richiesta: tipo,
    }
    try {
      const response = await firstValueFrom(this.userService.creaRichiesta(pacchetto));
      if(response.status == 201) {
        const alert = await this.alertController.create({
          header: 'Successo',
          message: 'Richiesta ivniata con successo!',
          buttons: ['OK']
        });
        await alert.present()
      }
    } catch(e) {
      if(e instanceof Error) {
        console.log('Errore nell\'invio della richiesta', e);
      }
    }

  }

    async eliminaAllenamento(id: number){
        try{
            const response = await firstValueFrom(this.workoutService.eliminaAllenamento(id));
            console.log('Allenamento eliminato con successo:', response);
            //ricarica la lista degli allenamenti dopo l'eliminazione
            this.loadAllenamentiUtente();
        } catch(e){
            console.error('Errore nell\'eliminazione dell\'allenamento:', e);
        }
    }
    
    onChiudi() {
        this.viewModifica = false;
    }

    votaAllenamento(id_allenamento:number) {

    }

    allenamentiUtente:Allenamento[] = [];

    loadAllenamentiUtente(){
        console.log('Caricamento allenamenti utente...');
        this.workoutService.getAllenamentiUtente().subscribe({
            next: (allenamenti) => {
                this.allenamentiUtente = allenamenti;
                console.log('Allenamenti caricati:', this.allenamentiUtente);
            },
            error: (err) => {
                console.error('Errore nel caricamento degli allenamenti:', err);
            }
        });
    }

    loadSingoloAllenamento(id_allnemento:number) {
        this.workoutService.getAllenamentoById(id_allnemento).pipe(takeUntil(this.destroy$)).subscribe({
              next: (allenamento) => this.allenamentiUtente = [allenamento],
              error: (err) => console.log(err)
            });
    }

    loadEsercizi() {
        this.workoutService.getEsercizi().subscribe({
            next: (data) => {this.esercizi = data;
            },
            error: (err) => {console.error(err);}
        });
    }
}