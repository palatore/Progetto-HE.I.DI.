import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { GestionePastiService } from 'src/app/services/pasti/gestione-pasti.service';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-pasti-utente',
  templateUrl: './pasti-utente.page.html',
  styleUrls: ['./pasti-utente.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonCard, IonLabel, IonCardHeader, IonCardContent, IonCardTitle, IonButton, RouterModule]
})
export class PastiUtentePage implements OnInit {
  totZuccheri:number = 0;
  totCalorie:number = 0;
  totGrassi:number = 0;
  totCarboidrati:number = 0;
  totVitamine:string = '';

  constructor(private foodService:GestionePastiService) { }

  ngOnInit() {
    this.loadPastiUtente();
  }

  ionViewWillEnter() {
    this.loadPastiUtente();
  }

  public pastoSelezionato: any = null;
  public dettagliPasto: any = null; // Variabile per i dettagli del pasto selezionato
  public visualizzaLista: boolean = false; // Variabile per gestire la visualizzazione a lista o griglia
  public visualizzaGriglia: boolean = true; // Variabile per gestire la visualizzazione a griglia o lista
  public visualizzaPerData: boolean = false; // Variabile per gestire la visualizzazione per data
  public filtroData: string = ''; // Variabile per il filtro per data
  public filtroTipo: string = ''; // Variabile per il filtro per tipo di pasto
  public filtroNome: string = ''; // Variabile per il filtro per nome del pasto
  public filtroCalorie: number = 0; // Variabile per il filtro per calorie
  public filtroAlimenti: string[] = []; // Variabile per il filtro per alimenti


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

  chiudiDettagli() {
    this.pastoSelezionato = null;
    this.totCalorie = 0;
    this.totCarboidrati = 0;
    this.totGrassi = 0;
    this.totZuccheri = 0;
    this.totVitamine = '';
  }

  async modificaPasto(id: number) {
    try {
      const response = await firstValueFrom(this.foodService.modificaPasto(id));
      console.log('Pasto modificato con successo:', response);
      // Ricarica i pasti utente dopo la modifica
      this.loadPastiUtente();
    } catch (e) {
      console.error('Errore nella modifica del pasto:', e);
    }
  }

  async eliminaPasto(id: number) {
    try {
      const response = await firstValueFrom(this.foodService.eliminaPasto(id));
      console.log('Pasto eliminato con successo:', response);
      // Ricarica i pasti utente dopo l'eliminazione
      this.loadPastiUtente();
    } catch (e) {
      console.error('Errore nell\'eliminazione del pasto:', e);
    }
  }

  pastiUtente = [{name: 'Pasto 1', data_creazione: '1/1/1000', tipo: 500, id: 1},
                 {name: 'Pasto 2', data_creazione: '1/1/1000', tipo: 600, id: 2},
                 {name: 'Pasto 3', data_creazione: '1/1/1000', tipo: 550, id: 3}];

  //DA IMPLEMENTARE:
  // - Filtri visualizzazione pasti
  // - Visualizzazione dettagli pasto
  // - Eliminazione pasto
  // - Modifica pasto
  // - Visualizzazione per lista/griglia
  // - Visualizzazione per data

  loadPastiUtente() {
    console.log('Caricamento pasti utente...');
    this.foodService.getPastiUtente().subscribe({
      next: (pasti) => {
        this.pastiUtente = pasti;
        console.log('Pasti caricati:', this.pastiUtente);
      },
      error: (err) => {
        console.error('Errore nel caricamento dei pasti:', err);
      }
    });
  }

}
