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
  public n_serie:number = 1;
  public n_pesi_kg:number = 1;
  public durata_min:number = 1;
  public isClosing:Boolean = false;

  @Input() dettaglio:any = null;
  @Input() dettaglio_img:string = '';
  @Input() foodBool:boolean = false;
  @Output() inLista = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {}

  getImgPath(dettaglio:any): string {
    if(this.foodBool){
      const parametro = dettaglio.name.toLowerCase().replace(/\s/g, '_');
      const imgPath = `assets/dettagli/${parametro}.png`;
      return imgPath;
    } else {
      const parametro = dettaglio.fase.toLowerCase().replace(/\s/g, '_');
      const imgPath = `assets/dettagli/${parametro}.png`;
      return imgPath;
    }  
  }

  mandaInLista() {
    console.log('Debug: sto inviando alla lista il dettaglio con id', this.dettaglio.id, 'nome', this.dettaglio.name, 'e quantità', this.quantita);
    this.inLista.emit({id_dettaglio: this.dettaglio.id, name: this.dettaglio.name, qta: this.quantita, serie: this.n_serie, pesi_kg: this.n_pesi_kg, durata: this.durata_min}); //anche se mandi oggetti con proprietà in più rispetto a quelle accettate dal componente padre non preoccuparti, verranno ignorate
    this.chiudi();
  }

  chiudi() {
    this.isClosing = true;
    setTimeout(() => {
      this.dettaglio = null;
      this.quantita = 1;
      this.n_serie = 1;
      this.n_pesi_kg = 0;
      this.durata_min = 1;
      this.isClosing = false;
    }, 400); // Durata dell'animazione in millisecondi
  }

}
