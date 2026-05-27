import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-info-dettagli',
  templateUrl: './info-dettagli.component.html',
  styleUrls: ['./info-dettagli.component.scss'],
  imports: [IonButton, CommonModule],
})
export class InfoDettagliComponent  implements OnInit {

  @Input() dettaglio:any = null;
  @Output() inLista = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {}

  chiudi() {
    this.dettaglio = null;
  }

}
