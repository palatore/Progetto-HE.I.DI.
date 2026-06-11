import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonCardContent, IonCard, IonCardHeader, IonInput, IonGrid, IonRow, IonCol, IonIcon } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-info-dettagli',
  templateUrl: './info-dettagli.component.html',
  styleUrls: ['./info-dettagli.component.scss'],
  imports: [IonIcon, IonGrid, IonRow, IonCol, IonIcon, IonInput, IonCardContent, IonButton, IonCard, IonCardHeader, CommonModule, FormsModule],
})
export class InfoDettagliComponent  implements OnInit {

  public dettaglio:any = null;
  public dettaglio_mostrato:any = null;
  public quantita:number = 1;
  public tipo_fase:string = ''; //variabile utile alla corretta visualizzazione della misura (secondi o ripetizioni) degli esercizi visualizzati
  public n_serie:number = 1;
  public n_ripetizioni:number = 1;
  public min_riposo:number = 1;
  public n_pesi_kg:number = 1;
  public isClosing:Boolean = false;

  @Input() 
  set mio_dettaglio(value:any){
    this.dettaglio = value;
    if(value){ //a priori dal dettaglio ricevuto valuta questa condizione. Anche se arriva un alimento non importa, perché non viene utilizzata la variabile tipo_fase
      this.tipo_fase = value.fase == 'Centrale' ?  'Ripetizioni'  : 'Secondi';
    }
  };

  @Input() dettaglio_img:string = '';
  @Input() foodBool:boolean = false;
  @Output() inLista = new EventEmitter<any>();


  constructor() {}

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
    console.log('Debug: sto inviando alla lista il dettaglio con id', this.dettaglio.id, 'nome', this.dettaglio.name, 'quantità', this.quantita, 'serie', this.n_serie, 'ripetizioni', this.n_ripetizioni, 'riposo', this.min_riposo, 'pesi_kg', this.n_pesi_kg);
    this.inLista.emit({id_dettaglio: this.dettaglio.id, name: this.dettaglio.name, qta: this.quantita, serie: this.n_serie, ripetizioni: this.n_ripetizioni, riposo: this.min_riposo, pesi_kg: this.n_pesi_kg}); //anche se mandi oggetti con proprietà in più rispetto a quelle accettate dal componente padre non preoccuparti, verranno ignorate
    this.chiudi();
  }

  chiudi() {
    this.isClosing = true;
    setTimeout(() => {
      this.dettaglio = null;
      this.quantita = 1;
      this.n_serie = 1;
      this.n_pesi_kg = 0;
      this.isClosing = false;
    }, 400); // Durata dell'animazione in millisecondi
  }

}
