import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GestionePastiService } from 'src/app/services/utente/gestione-pasti.service';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-pasti-utente',
  templateUrl: './pasti-utente.page.html',
  styleUrls: ['./pasti-utente.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonGrid, IonRow, IonCol, IonItem, IonCard, IonLabel, IonListHeader, IonCardHeader, IonCardContent, IonButton, RouterModule]
})
export class PastiUtentePage implements OnInit {

  constructor(private pastiService:GestionePastiService) { }

  ngOnInit() {
    this.loadPastiUtente();
  }

  pastiUtente = [{nome: 'Pasto 1', data: '2023-10-01', tipo: 500, id: 1},
                 {nome: 'Pasto 2', data: '2023-10-02', tipo: 600, id: 2},
                 {nome: 'Pasto 3', data: '2023-10-03', tipo: 550, id: 3}];

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
