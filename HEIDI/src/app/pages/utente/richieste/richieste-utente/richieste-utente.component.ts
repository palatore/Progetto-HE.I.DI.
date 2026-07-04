import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonBadge, IonButton, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-richieste-utente',
  templateUrl: './richieste-utente.component.html',
  styleUrls: ['./richieste-utente.component.scss'],
  imports: [RouterModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonBadge, IonButton, IonIcon]
})
export class RichiesteUtenteComponent  implements OnInit {

  @Input() richieste_utente:any[] = [];
  @Input() ruoloUtente:string | null = null;

  @Output() rifiuta = new EventEmitter<number>;

  constructor() { }

  ngOnInit() {}
  //Se riesci implementa filtri visualizzazione richieste

}
