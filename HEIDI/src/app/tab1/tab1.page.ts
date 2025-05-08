import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle, IonGrid, IonRow, IonCol, IonIcon, IonDatetime } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonGrid, IonRow, IonCol, IonIcon, IonDatetime, IonCardContent, IonCardTitle, IonCardSubtitle, IonCardHeader],
})
export class Tab1Page {
  constructor() {
    addIcons({
      'calendar': 'assets/icon/calendar.png',});
  }

  name: string = 'Utente';
}
