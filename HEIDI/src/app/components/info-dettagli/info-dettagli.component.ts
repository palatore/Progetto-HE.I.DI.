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
  public dettaglio:any = null;
  public dettaglio_mostrato:any = null;
  public quantita:number = 1;
  public tipo_fase:string = '';
  public n_serie:number = 1;
  public n_ripetizioni:number = 1;
  public min_riposo:number = 1;
  public n_pesi_kg:number = 1;
  public isClosing:Boolean = false;

  @Input() 
  set mio_dettaglio(value:any){
    this.dettaglio = value;
    if(value){
      this.tipo_fase = value.fase == 'Centrale' ?  'Ripetizioni'  : 'Secondi';
    }
  };

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
<<<<<<< HEAD
    }else{
      const parametro = dettaglio.fase.toLowerCase();
      const imgPath = `assets/dettagli/${parametro}.png`;
      return imgPath;
    }
=======
    } else {
      const parametro = dettaglio.fase.toLowerCase().replace(/\s/g, '_');
      const imgPath = `assets/dettagli/${parametro}.png`;
      return imgPath;
    }  
>>>>>>> 193772d36fb8abc499ddc172c7b3997a9f8b3e74
  }

  mandaInLista() {
    console.log('Debug: sto inviando alla lista il dettaglio con id', this.dettaglio.id, 'nome', this.dettaglio.name);
    this.inLista.emit({id_dettaglio: this.dettaglio.id, name: this.dettaglio.name, qta: this.quantita, serie: this.n_serie, pesi_kg: this.n_pesi_kg, ripetizioni: this.n_ripetizioni, riposo: this.min_riposo}); //anche se mandi oggetti con proprietà in più rispetto a quelle accettate dal componente padre non preoccuparti, verranno ignorate
    this.chiudi();
  }

  chiudi() {
    this.isClosing = true;
    setTimeout(() => {
      this.dettaglio = null;
      this.quantita = 1;
      this.n_serie = 1;
<<<<<<< HEAD
      this.n_ripetizioni = 1;
      this.min_riposo = 1;
      this.n_pesi_kg = 1;
=======
      this.n_pesi_kg = 0;
      this.durata_min = 1;
>>>>>>> 193772d36fb8abc499ddc172c7b3997a9f8b3e74
      this.isClosing = false;
    }, 400); // Durata dell'animazione in millisecondi
  }

}
