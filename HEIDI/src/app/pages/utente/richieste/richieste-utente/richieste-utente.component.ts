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

  richiesta: {id:number, id_att:number, tipologia:number, tipo:string} = {id: 0, id_att: 0, tipologia:0, tipo:''};

  @Output() accetta = new EventEmitter<any>
  @Output() rifiuta = new EventEmitter<number>;

  constructor() { }

  ngOnInit() {}
  //Se riesci implementa filtri visualizzazione richieste

  accettaRichiesta(id_richiesta:number, id_attivita:number, tipologia_attivita:number, tipo_richiesta:string) {
    this.richiesta = {id: id_richiesta, id_att: id_attivita, tipologia: tipologia_attivita, tipo: tipo_richiesta};
    this.accetta.emit(this.richiesta);
  }

  rifiutaRichiesta(id_richiesta:number) {
    this.rifiuta.emit(id_richiesta);
  }
}
