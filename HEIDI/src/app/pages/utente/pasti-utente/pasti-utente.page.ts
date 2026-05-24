import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GestionePastiService } from 'src/app/services/pasti/gestione-pasti.service';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonRow, IonTitle, IonToolbar, ViewWillEnter } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-pasti-utente',
  templateUrl: './pasti-utente.page.html',
  styleUrls: ['./pasti-utente.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonGrid, IonRow, IonCol, IonItem, IonCard, IonLabel, IonListHeader, IonCardHeader, IonCardContent, IonCardTitle, IonButton, RouterModule]
})
export class PastiUtentePage implements OnInit {

  constructor(private pastiService:GestionePastiService) { }

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
    try {
      // Simula una chiamata al servizio per ottenere i dettagli del pasto
      this.dettagliPasto = await this.pastiService.getDettagliPasto(pasto.id).toPromise();
      console.log('Dettagli del pasto:', this.dettagliPasto);
    } catch (error) {
      console.error('Errore nel caricamento dei dettagli del pasto:', error);
    }
  }

  chiudiDettagli() {
    this.pastoSelezionato = null;
  }

  async modificaPasto(id: number) {
    try {
      const response = await this.pastiService.modificaPasto(id).toPromise();
      console.log('Pasto modificato con successo:', response);
      // Ricarica i pasti utente dopo la modifica
      this.loadPastiUtente();
    } catch (e) {
      console.error('Errore nella modifica del pasto:', e);
    }
  }

  async eliminaPasto(id: number) {
    try {
      const response = await this.pastiService.eliminaPasto(id).toPromise();
      console.log('Pasto eliminato con successo:', response);
      // Ricarica i pasti utente dopo l'eliminazione
      this.loadPastiUtente();
    } catch (e) {
      console.error('Errore nell\'eliminazione del pasto:', e);
    }
  }

  pastiUtente = [{nome: 'Pasto 1', data_creazione: '', tipo: 500, id: 1},
                 {nome: 'Pasto 2', data_creazione: '', tipo: 600, id: 2},
                 {nome: 'Pasto 3', data_creazione: '', tipo: 550, id: 3}];

  //DA IMPLEMENTARE:
  // - Caricamento pasti utente a inizio pagina usando i onInit e token
  // - Filtri visualizzazione pasti
  // - Visualizzazione dettagli pasto
  // - Eliminazione pasto
  // - Modifica pasto
  // - Visualizzazione per lista/griglia
  // - Visualizzazione per data

  loadPastiUtente() {
    console.log('Caricamento pasti utente...');
    this.pastiService.getPastiUtente().subscribe({
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
