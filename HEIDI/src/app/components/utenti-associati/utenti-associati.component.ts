import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';

@Component({
  selector: 'app-utenti-associati',
  templateUrl: './utenti-associati.component.html',
  styleUrls: ['./utenti-associati.component.scss'],
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonButton, IonList, IonIcon]
})
export class UtentiAssociatiComponent  implements OnInit {

  @Input() utenti_associati:any[] = [];
  @Input() flag_utenti:boolean = false; //false per mostrare professionisti, true per mostrare utenti

  @Output() cancella_associazione = new EventEmitter<number>;

  constructor() { }

  ngOnInit() {}

  richiediAnnullamento(id_associazione:number) {
    this.cancella_associazione.emit(id_associazione);
  }

}
