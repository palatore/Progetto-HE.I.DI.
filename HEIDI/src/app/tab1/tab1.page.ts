import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonGrid, IonRow, IonCol, IonItem } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonGrid, IonRow, IonCol, IonItem],
})
export class Tab1Page {
  constructor() {}

  name: string = 'Allah';
}
