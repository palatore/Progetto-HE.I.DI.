import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonSelect, IonInput, IonLabel, IonItem, IonSelectOption } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonSelect, IonList, IonInput, IonLabel, IonItem, IonSelectOption],
})
export class Tab3Page {
  constructor() {}
}
