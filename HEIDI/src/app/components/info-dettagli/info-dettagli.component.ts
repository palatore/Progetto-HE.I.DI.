import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonCardContent, IonCard, IonCardHeader, IonInput } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-info-dettagli',
  templateUrl: './info-dettagli.component.html',
  styleUrls: ['./info-dettagli.component.scss'],
  imports: [IonInput, IonCardContent, IonButton, IonCard, IonCardHeader, CommonModule, FormsModule],
})
export class InfoDettagliComponent  implements OnInit {
  dettaglio_mostrato:any = null;
  public quantita:number = 0

  @Input() dettaglio:any = null;
  @Output() inLista = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {}

  mandaInLista() {
    console.log('Debug: sto inviando alla lista il dettaglio con id', this.dettaglio.id, 'e quantità', this.quantita);
    this.inLista.emit({id_alimento: this.dettaglio.id, qta: this.quantita});
    this.chiudi();
  }

  chiudi() {
    this.dettaglio = null;
  }

}
