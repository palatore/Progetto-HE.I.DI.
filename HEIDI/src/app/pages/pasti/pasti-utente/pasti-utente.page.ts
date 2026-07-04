import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Pasto } from 'src/app/models/pasto.model';
import { GestionePastiService } from 'src/app/services/pasti/gestione-pasti.service';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar, IonIcon, IonMenuButton, IonModal, AlertController } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { ModificaDettagliComponent } from 'src/app/components/modifica-dettagli/modifica-dettagli.component';
import { GestioneUtentiService } from 'src/app/services/utenti/gestione-utenti.service';


@Component({
  selector: 'app-pasti-utente',
  templateUrl: './pasti-utente.page.html',
  styleUrls: ['./pasti-utente.page.scss'],
  standalone: true,
  imports: [IonModal, IonButtons, IonMenuButton, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonCard, IonLabel, IonCardHeader, IonCardContent, IonCardTitle, IonButton, RouterModule, ModificaDettagliComponent]
})
export class PastiUtentePage implements OnInit {
  totZuccheri:number = 0;
  totCalorie:number = 0;
  totGrassi:number = 0;
  totCarboidrati:number = 0;
  totVitamine:string = '';

  public alimenti:any[] = [];
  public professionisti_disponibili:any[] = [];
  public viewModifica:boolean = false;

  public id_pasto_richiesta!:number;
  public pastoSelezionato: any = null;
  public pasto_da_modificare: any = null;
  public alimentoSelezionato:any = null;
  public dettagliPasto: any = null; // Variabile per i dettagli del pasto selezionato
  public visualizzaLista: boolean = false; // Variabile per gestire la visualizzazione a lista o griglia
  public visualizzaGriglia: boolean = true; // Variabile per gestire la visualizzazione a griglia o lista
  public visualizzaPerData: boolean = false; // Variabile per gestire la visualizzazione per data
  public filtroData: string = ''; // Variabile per il filtro per data
  public filtroTipo: string = ''; // Variabile per il filtro per tipo di pasto
  public filtroNome: string = ''; // Variabile per il filtro per nome del pasto
  public filtroCalorie: number = 0; // Variabile per il filtro per calorie
  public filtroAlimenti: string[] = []; // Variabile per il filtro per alimenti

  constructor(private foodService:GestionePastiService, private userService:GestioneUtentiService, private alertController:AlertController) { }

  ngOnInit() {
    this.loadPastiUtente();
    this.loadAlimenti();
  }

  ionViewWillEnter() {
    this.loadPastiUtente();
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
      if(error instanceof Error) {
        console.error(error.message);
        return;
      } else if(error.status == 404)
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
    } catch (e) {
      console.error('Errore nella modifica del pasto:', e);
    }
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
      if(response && response.status === 201) {
        console.log('Richiesta inviata con successo', response);
        const alert = this.alertController.create({
          header: 'Successo',
          message: 'Richiesta ivniata con successo!',
          buttons: ['OK']
        });
      }
    } catch(e) {
      if(e instanceof Error) {
        console.log('Errore nell\'invio della richiesta', e);
      }
    }

  }

  async eliminaPasto(id_pasto: number) {
    try {
      const response = await firstValueFrom(this.foodService.eliminaPasto(id_pasto));
      console.log('Pasto eliminato con successo:', response);
      // Ricarica i pasti utente dopo l'eliminazione
      this.loadPastiUtente();
    } catch (e) {
      console.error('Errore nell\'eliminazione del pasto:', e);
    }
  }

  onChiudi() {
    this.viewModifica = false;
  }

  pastiUtente:Pasto[] = [{name: 'Pasto 1', data_creazione: '1/1/1000', tipo: '', id: 1, data_calendario:'1/1/1000'},
                 {name: 'Pasto 2', data_creazione: '1/1/1000', tipo: '', id: 2, data_calendario:'1/1/1000'},
                 {name: 'Pasto 3', data_creazione: '1/1/1000', tipo: '550', id: 3, data_calendario:'1/1/1000'}];

  //DA IMPLEMENTARE:
  // - Filtri visualizzazione pasti
  // - Modifica pasto
  // - Visualizzazione per lista/griglia
  // - Visualizzazione per data

  loadPastiUtente() {
    console.log('Caricamento pasti utente...');
    this.foodService.getPastiUtente().subscribe({
      next: (pasti) => {
        this.pastiUtente = pasti;      
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  loadAlimenti() {
    this.foodService.getAlimenti().subscribe({
      next: (data) => {this.alimenti = data;},
      error: (err) => {console.error(err);}
    });
  }
}