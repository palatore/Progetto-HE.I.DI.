import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GestioneAllenamentiService } from "src/app/services/allenamenti/gestione-allenamenti.service";
import { IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonList, IonLabel, IonItem, IonIcon, IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonButtons, IonMenuButton, AlertController, IonModal } from "@ionic/angular/standalone";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ModificaDettagliComponent } from "src/app/components/modifica-dettagli/modifica-dettagli.component";
import { VotaAttivitaComponent } from "src/app/components/vota-attivita/vota-attivita.component";
import { firstValueFrom } from "rxjs/internal/firstValueFrom";
import { Allenamento } from "src/app/models/allenamento.model";
import { GestioneUtentiService } from "src/app/services/utenti/gestione-utenti.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators"
import { DefaultHeaderComponent } from "src/app/components/default-header/default-header.component";
import { GestioneBachecaService } from "src/app/services/bacheca/gestione-bacheca.service";

@Component({
    selector: 'app-allenamenti-utente',
    templateUrl: './allenamenti-utente.page.html',
    styleUrls: ['./allenamenti-utente.page.scss'],
    standalone: true,
    imports: [VotaAttivitaComponent, IonModal, IonCardContent, IonCardHeader, IonCardTitle, IonCard, IonIcon, IonItem, IonLabel, IonList, IonContent, IonButton, IonButtons, IonTitle, IonHeader, IonToolbar, RouterModule, CommonModule, ModificaDettagliComponent, DefaultHeaderComponent]
})
export class AllenamentiUtentePage implements OnInit{

    //VARIABILI LATO UTENTE
    public professionisti_disponibili:any[] = [];

    //VARIABILI LATO PROFESSIONISTA
    public professionista_modifica:boolean = false;
    public professionista_vota:boolean = false;

    //VARIABILI CONDIVISE
    public id_allenamento_richiesta!:number;
    public viewModifica:boolean = false;
    public modalita_voto:boolean = false;
    public voti_totali_allenamento:number = 0;
    public esercizi:any[] = [];
    public allenamentoSelezionato: any = null;
    public allenamento_da_modificare: any = null;
    public esercizioSelezionato:any = null;
    public dettagliAllenamento: any = null;
    public voto_allenamento_caricato:number = 0;
    public destroy$ = new Subject<void>;

    constructor(private workoutService:GestioneAllenamentiService, private route:ActivatedRoute, private router:Router, private alertController: AlertController, private userService:GestioneUtentiService, private boardService:GestioneBachecaService){ }

    ngOnInit(){
        this.loadEsercizi();
    }

    ionViewWillEnter(){
        const id_allenamentoString = this.route.snapshot.queryParamMap.get('allenamento_id');
        const allenamento_id:number = +id_allenamentoString!;
        const tipo_richiesta = this.route.snapshot.queryParamMap.get('tipo_richiesta');
        if(allenamento_id && tipo_richiesta === 'MODIFICA') {
        //logica professionista modifica
        this.professionista_modifica = true;
        this.loadSingoloAllenamento(allenamento_id);
        } else if(id_allenamentoString && tipo_richiesta === 'VOTO') {
        //logica professionista vota
        this.professionista_vota = true;
        this.loadSingoloAllenamento(allenamento_id);
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
        this.esercizioSelezionato = await this.datiEsercizio(id_esercizio);
    }

    async datiEsercizio(id_esercizio:number): Promise<any> {
        try {
            const response = await firstValueFrom(this.workoutService.getEsercizioById(id_esercizio));
            if(response) {
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
        } catch (err){
            console.log(err);
        }
        this.allenamento_da_modificare = allenamento;
        this.viewModifica = true;
    }

    async confermaModificaAllenamento(modifiche: any[]) {
        try {
            const id_allenamento_modificato = this.allenamento_da_modificare.id;
            const response = await firstValueFrom(this.workoutService.modificaAllenamento(id_allenamento_modificato, modifiche));
            this.loadAllenamentiUtente();
        } catch (error) {
            console.error('Errore nella modifica dell\'allenamento:', error);
        }
    }

    getVotoAllenamento(id_allenamento:number) {
    this.boardService.getVotiAttivita(id_allenamento, 1).pipe(takeUntil(this.destroy$)).subscribe({
      next: (voti) => {
        this.voti_totali_allenamento = voti.length;

        if(voti && voti.length > 0) {
          let somma = 0;

          for(let i = 0; i < voti.length; i++) {
            somma += Number(voti[i].voto);
          }

          const media = somma/voti.length;

          this.voto_allenamento_caricato = Math.round(media * 10)/10;
        } else {
          this.voto_allenamento_caricato = 0;
        }
      },
      error: (err) => console.log('Errore nel caricamento e calcolo del voto')
    });
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
    } catch(error) {
        console.log(error);
    }
  }

  async condividiAllenamento(id_allenamento:number) {
    try {
      const response = await firstValueFrom(this.boardService.getSingolaAttivitaBacheca(id_allenamento, 1));
      if(response?.result) {
        const alert = await this.alertController.create({
            header: 'Già presente',
            message: 'Questo allenamento è già nella bacheca.',
            buttons: ['OK']
        });
        await alert.present();
        return;
      }
    } catch (error: any) {
    if (error.status !== 404) {
      return; 
    }
  }
    try {
      const response = await firstValueFrom(this.boardService.condividiAttivita(id_allenamento, 1));
      if(response.status === 201) {
        const alert = await this.alertController.create({
          header: 'Successo',
          message: 'Allenamento condiviso con successo!',
          buttons: ['OK']
        });
        await alert.present()
      }
    } catch (error) {
      console.log(error);
    }
  }

    async eliminaAllenamento(id: number){
        try{
            const response = await firstValueFrom(this.workoutService.eliminaAllenamento(id));
            this.loadAllenamentiUtente();
        } catch(error){
            console.error('Errore nell\'eliminazione dell\'allenamento:', error);
        }
    }
    
    onChiudi() {
        this.viewModifica = false;
    }

    votaAllenamento(id_allenamento:number) {
        if(this.modalita_voto) {
        this.modalita_voto = false;
        return;
        }
        this.id_allenamento_richiesta = id_allenamento;
        this.getVotoAllenamento(id_allenamento);
        this.modalita_voto = true;
    }

    async inviaVoto(voto:number, id_allenamento:number) {
    try {
      const voto_da_inviare = {id: id_allenamento, valutazione:voto, tipologia:1};
      const response = await firstValueFrom(this.boardService.votaAttivita(voto_da_inviare));
      if(response.status === 201) {
        const alert = await this.alertController.create({
            header: 'Successo',
            message: 'Allenamento votato con successo!',
            buttons: [{
              text: 'Torna alle richieste',
              handler: () => {
                this.router.navigate(['/richieste']);
              }
            }]
          });
          await alert.present()
      }

      this.modalita_voto = false;
    } catch(error) {
      console.log(error);
    }
  }

    allenamentiUtente:Allenamento[] = [];

    loadAllenamentiUtente(){
        this.workoutService.getAllenamentiUtente().subscribe({
            next: (allenamenti) => {
                this.allenamentiUtente = allenamenti;
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