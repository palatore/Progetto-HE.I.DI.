import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonCard, IonCardHeader, IonCardContent, IonTitle, IonGrid, IonRow, IonCol, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RiempiDettagliComponent } from "../riempi-dettagli/riempi-dettagli.component";

@Component({
  selector: 'app-modifica-dettagli',
  templateUrl: './modifica-dettagli.component.html',
  styleUrls: ['./modifica-dettagli.component.scss'],
  imports: [IonCard, IonCardHeader, IonCardContent, IonTitle, IonGrid, IonRow, IonCol, IonButton, IonIcon, RiempiDettagliComponent]
})
export class ModificaDettagliComponent {


  /* ordine pensato:
  1. il component riceve i dati dal padre
  2. il component crea un array in linea con il component riempidettagli
  3. il component passa l'array e il attivita al component riempi dettagli che visualizza tutto nella tabella
  4. il component riempi dettagli si comporta normalmente e passa i nuovi dati
  5. il component riceve i dati dal figlio e li prepara per la modifica al padre
  6. il component passa i dati al padre che chiama il service
  */
  constructor() { }

  attivita_da_modificare: any;
  dettagli_da_db: any[] = [];
  dettagli_attivita_da_modificare:any;


  public isClosing:Boolean = false;
  @Input() isShow: boolean = false;
  @Input() foodBool: boolean = false;
  @Input()
    set miaAttivita(value:any) {
      this.attivita_da_modificare = value;
    }
    get getMiaAttivita() {
      return this.attivita_da_modificare;
    }
  @Input()
    set listaDettagli(lista:any[]) {
      this.dettagli_da_db = lista;
    }
  @Input()
    set mioDettaglio(value:any) {
      if(this.foodBool) {
        this.dettagli_attivita_da_modificare = value?.alimenti;
      } else {
        this.dettagli_attivita_da_modificare = value?.esercizi;
      }
    }
  @Output() chiudi =  new EventEmitter<void>();
  @Output() inviaModifiche = new EventEmitter<any[]>();


  clickChiudi() {
    this.isClosing = true;
    setTimeout(() => {
      this.chiudi.emit();
      this.isClosing = false;
    },400) //durata animazione
  }

}
