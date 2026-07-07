import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { Pasto } from 'src/app/models/pasto.model';
import { GestionePastiService } from 'src/app/services/pasti/gestione-pasti.service';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar, IonIcon, IonModal, AlertController } from '@ionic/angular/standalone';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DefaultHeaderComponent } from 'src/app/components/default-header/default-header.component';
import { ModificaDettagliComponent } from 'src/app/components/modifica-dettagli/modifica-dettagli.component';
import { GestioneUtentiService } from 'src/app/services/utenti/gestione-utenti.service';
import { VotaAttivitaComponent } from "src/app/components/vota-attivita/vota-attivita.component";


@Component({
  selector: 'app-pasti-utente',
  templateUrl: './pasti-utente.page.html',
  styleUrls: ['./pasti-utente.page.scss'],
  standalone: true,
  imports: [DefaultHeaderComponent, IonModal, IonButtons, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonCard, IonLabel, IonCardHeader, IonCardContent, IonCardTitle, IonButton, RouterModule, ModificaDettagliComponent, VotaAttivitaComponent]
})
export class PastiUtentePage implements OnInit {
  totZuccheri:number = 0;
  totCalorie:number = 0;
  totGrassi:number = 0;
  totCarboidrati:number = 0;
  totVitamine:string = '';

  //VARIABILI LATO UTENTE
  public professionisti_disponibili:any[] = [];

  //VARIABILI LATO PROFESSIONISTA
  public professionista_modifica:boolean = false;
  public professionista_vota:boolean = false;

  //VARIABILI CONDIVISE
  public viewModifica:boolean = false;
  public alimenti:any[] = [];
  public id_pasto_richiesta!:number;
  public pastoSelezionato: any = null;
  public pasto_da_modificare: any = null;
  public alimentoSelezionato:any = null;
  public dettagliPasto: any = null;
  public modalita_voto:boolean = false;
  public voti_totali_pasto:number = 0;
  public voto_pasto_caricato:number = 0;
  public destroy$ = new Subject<void>;
  public visualizzaLista: boolean = false; // Variabile per gestire la visualizzazione a lista o griglia
  public visualizzaGriglia: boolean = true; // Variabile per gestire la visualizzazione a griglia o lista
  public visualizzaPerData: boolean = false; // Variabile per gestire la visualizzazione per data
  public filtroData: string = ''; // Variabile per il filtro per data
  public filtroTipo: string = ''; // Variabile per il filtro per tipo di pasto
  public filtroNome: string = ''; // Variabile per il filtro per nome del pasto
  public filtroCalorie: number = 0; // Variabile per il filtro per calorie
  public filtroAlimenti: string[] = []; // Variabile per il filtro per alimenti

  constructor(private foodService:GestionePastiService, private userService:GestioneUtentiService, private route:ActivatedRoute, private router:Router, private alertController:AlertController) { }


  //METODI LIFECYCLE PAGINA
  ngOnInit() {
    this.loadAlimenti();
  }

  ionViewWillEnter() {
    const id_pastoString = this.route.snapshot.queryParamMap.get('pasto_id');
    const id_pasto:number = +id_pastoString!;
    const tipo_richiesta = this.route.snapshot.queryParamMap.get('tipo_richiesta');
    if(id_pasto && tipo_richiesta === 'MODIFICA') {
      //logica professionista modifica
      this.professionista_modifica = true;
      console.log('Professionista in visita per modifica del pasto:', id_pastoString);
      this.loadSingoloPasto(id_pasto);
    } else if(id_pastoString && tipo_richiesta === 'VOTO') {
      //logica professionista vota
      this.professionista_vota = true;
      console.log('Professionista in visita per votazione del pasto:', id_pastoString);
      this.loadSingoloPasto(id_pasto);
    } else {
      this.loadPastiUtente();
    }
  }
  
  ionViewWillLeave() {
    this.professionista_modifica = false;
    this.professionista_vota = false;
    this.destroy$.next();
  }

  //METODI CONDIVISI----------------------------------------------------------------------------

  loadAlimenti() {
    this.foodService.getAlimenti().subscribe({
      next: (data) => {this.alimenti = data;},
      error: (err) => {console.error(err);}
    });
  }

  async mostraDettagli(pasto: any) {
    this.pastoSelezionato = pasto;
    this.dettagliPasto = null; // Resetta i dettagli del pasto selezionato
    //Effettua una chiamata al servizio per ottenere i dettagli del pasto selezionato
    try {
      this.dettagliPasto = await firstValueFrom(this.foodService.getDettagliPasto(pasto.id));
      console.log('Dettagli del pasto:', this.dettagliPasto);
    } catch (error) {
      console.error('Errore nel caricamento dei dettagli del pasto:', error);
    }
    this.calcolaDettagliPasto(this.dettagliPasto);
  }

  calcolaDettagliPasto(listaDettagli: any) {
    for (let alimento of listaDettagli.alimenti) {
      this.totZuccheri += alimento.zuccheri_g * alimento.quantita / 100;
      this.totCalorie += alimento.kcal * alimento.quantita / 100;
      this.totGrassi += alimento.grassi_g * alimento.quantita / 100;
      this.totCarboidrati += alimento.carboidrati_g * alimento.quantita / 100;
    }

  }

  pastoTrack(index: number, pasto: Pasto):string {
    return `${pasto.name}-${pasto.data_creazione}-${pasto.tipo}`;
  }

  alimentoTrack(index: number, alimento: any):string {
    return `${alimento.name}-${alimento.quantita}-${alimento.kcal}`;
  }

  async getAlimento(id_alimento:number) {
    console.log('Ricevuto id da cercare:', id_alimento);
    this.alimentoSelezionato = await this.datiAlimento(id_alimento);
  }

  async datiAlimento(id_alimento:number): Promise<any> {
    try {
      const response = await firstValueFrom(this.foodService.getAlimentoById(id_alimento));
      if(response) {
        console.log('trovato:', response)
        return response;
      }
    } catch (error:any) {
      console.log(error);
      if(error.status == 404)
       console.log('Alimento non trovato per id:', id_alimento);
       this.alimentoSelezionato =  null;
    }

  }

  chiudiDettagli() {
    this.pastoSelezionato = null;
    this.totCalorie = 0;
    this.totCarboidrati = 0;
    this.totGrassi = 0;
    this.totZuccheri = 0;
    this.totVitamine = '';
  }

  async modificaPasto(pasto: Pasto) {
    try {
      this.dettagliPasto = await firstValueFrom(this.foodService.getDettagliPasto(pasto.id));
    } catch(err) {
      console.log(err);
    }
    this.pasto_da_modificare = pasto;
    this.viewModifica = true;
  }

  async confermaModificaPasto(modifiche: any[]) {
    try {
      const id_pasto_modificato = this.pasto_da_modificare.id;
      const response = await firstValueFrom(this.foodService.modificaPasto(id_pasto_modificato, modifiche));
      console.log('Pasto modificato con successo:', response);
      // Ricarica i pasti utente dopo la modifica
      this.loadPastiUtente();
    } catch (error) {
      console.error('Errore nella modifica del pasto:', error);
    }
  }

  getVotoPasto(id_pasto:number) {
    this.userService.getVotiAttivita(id_pasto, 0).pipe(takeUntil(this.destroy$)).subscribe({
      next: (voti) => {
        this.voti_totali_pasto = voti.length;

        if(voti && voti.length > 0) {
          let somma = 0;

          for(let i = 0; i < voti.length; i++) {
            somma += Number(voti[i].voto);
          }

          const media = somma/voti.length;

          this.voto_pasto_caricato = Math.round(media * 10)/10;
        } else {
          this.voto_pasto_caricato = 0;
        }
      },
      error: (err) => console.log('Errore nel caricamento e calcolo del voto')
    });
  }

  onChiudi() {
    this.viewModifica = false;
  }

  //METODI LATO UTENTE

  loadPastiUtente() {
    console.log('Caricamento pasti utente...');
    this.foodService.getPastiUtente().pipe(takeUntil(this.destroy$)).subscribe({
      next: (pasti) => {
        this.pastiUtente = pasti;      
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  apriRichiesta(id_pasto:number) {
    this.id_pasto_richiesta = id_pasto;

    this.userService.getAssociazioniUtente().subscribe({
      next: (data) => {
        this.professionisti_disponibili = data.filter(professionista => professionista.ruolo === 1);
      },
      error: (err) => console.log(err)
    });
  }

  async inviaRichiesta(id_prof:number, tipo:string) {
    const pacchetto = {
      id_professionista: id_prof,
      id_attivita: this.id_pasto_richiesta,
      tipologia_attivita: 0,
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

  async eliminaPasto(id_pasto: number) {
    try {
      const response = await firstValueFrom(this.foodService.eliminaPasto(id_pasto));
      console.log('Pasto eliminato con successo:', response);
      // Ricarica i pasti utente dopo l'eliminazione
      this.loadPastiUtente();
    } catch (error) {
      console.error('Errore nell\'eliminazione del pasto:', error);
    }
  }

  //METODI LATO PROFESSIONISTA-----------------------------------------------------------------------
  
  loadSingoloPasto(id_pasto:number) {
    this.foodService.getPastoById(id_pasto).pipe(takeUntil(this.destroy$)).subscribe({
      next: (pasto) => this.pastiUtente = [pasto],
      error: (err) => console.log(err)
    });
  }

  votaPasto(id_pasto:number) {
    if(this.modalita_voto) {
      this.modalita_voto = false;
      return;
    }
    this.id_pasto_richiesta = id_pasto;
    this.getVotoPasto(id_pasto);
    this.modalita_voto = true;
  }

  async inviaVoto(voto:number, id_pasto:number) {
    try {
      const voto_da_inviare = {id: id_pasto, valutazione:voto, tipologia:0};
      const response = await firstValueFrom(this.userService.votaAttivita(voto_da_inviare));
      if(response.status === 201) {
        const alert = await this.alertController.create({
            header: 'Successo',
            message: 'Pasto votato con successo!',
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

  pastiUtente:Pasto[] = [{name: 'Pasto 1', data_creazione: '1/1/1000', tipo: '', id: 1, data_calendario:'1/1/1000'},
                 {name: 'Pasto 2', data_creazione: '1/1/1000', tipo: '', id: 2, data_calendario:'1/1/1000'},
                 {name: 'Pasto 3', data_creazione: '1/1/1000', tipo: '550', id: 3, data_calendario:'1/1/1000'}];

  //DA IMPLEMENTARE:
  // - Filtri visualizzazione pasti
  // - Modifica pasto
  // - Visualizzazione per lista/griglia
  // - Visualizzazione per data
}