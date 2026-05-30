import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonCardContent, IonCard, IonCardHeader, IonInput, IonContent, IonGrid, IonRow, IonCol, IonIcon } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-info-dettagli',
  templateUrl: './info-dettagli.component.html',
  styleUrls: ['./info-dettagli.component.scss'],
  imports: [IonIcon, IonGrid, IonRow, IonCol, IonIcon, IonContent, IonInput, IonCardContent, IonButton, IonCard, IonCardHeader, CommonModule, FormsModule],
})
export class InfoDettagliComponent  implements OnInit {
  public dettaglio_mostrato:any = null;
  public quantita:number = 1
  public isClosing:Boolean = false;

  @Input() dettaglio:any = null;
  @Input() dettaglio_img:string = '';
  @Output() inLista = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {}

  getImgPath(dettaglio:any): string {
    const parametro = dettaglio.name.toLowerCase().replace(/\s/g, '_');
    const imgPath = `assets/dettagli/${parametro}.png`;
    return imgPath;
  }

  mandaInLista() {
    console.log('Debug: sto inviando alla lista il dettaglio con id', this.dettaglio.id, 'e quantità', this.quantita);
    this.inLista.emit({id_alimento: this.dettaglio.id, qta: this.quantita});
    this.chiudi();
  }

  chiudi() {
    this.isClosing = true;
    setTimeout(() => {
      this.dettaglio = null;
      this.quantita = 1;
      this.isClosing = false;
    }, 400); // Durata dell'animazione in millisecondi
  }

}
