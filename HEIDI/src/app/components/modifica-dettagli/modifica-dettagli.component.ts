import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonCard, IonCardHeader, IonCardContent, IonTitle, IonGrid, IonRow, IonCol, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RiempiDettagliComponent } from "../riempi-dettagli/riempi-dettagli.component";
import { InfoDettagliComponent } from "../info-dettagli/info-dettagli.component";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-modifica-dettagli',
  templateUrl: './modifica-dettagli.component.html',
  styleUrls: ['./modifica-dettagli.component.scss'],
  standalone: true,
  imports: [DatePipe, IonCard, IonCardHeader, IonCardContent, IonTitle, IonGrid, IonRow, IonCol, IonButton, IonIcon, RiempiDettagliComponent, InfoDettagliComponent]
})
export class ModificaDettagliComponent {


  /* Logica componente:
  1. Riceve i dati dal padre: attivita_da_modificare, dettagli_da_db, dettagli_attivita_da_modificare
  2. Passa attivita_da_modificare.id e dettagli_attivita_da_modificare al component riempi dettagli che visualizza tutto nella tabella
  3. Il component riempi dettagli si comporta normalmente e passa i nuovi dati
    3.1. Riempi dettagli e info dettagli comunicnano attraverso questo component e attraverso il padre che interroga il serivice
    3.2. Il modo in cui comunicano è tramite input e output in catena per passarsi i dati, come in creazione pasto ma con un passaggio in più
    3.3 Le variabili usate sono:
      dettaglio_selezionato che passa a info-dettagli,
      dettaglio_selezionato_in_attesa che passa al padre dopo aver ricevuto un emit da Riempi-dettagli
  4. Riceve i dati dal Riempi-dettagli e li prepara per la modifica al padre
  5. Passa i dati al padre che chiama il service
  */

  //DA RISOLVERE, RIMANE APERTO INFO DETTAGLI SUL DETTAGLIO PRECEDENTE

  constructor() {}

  attivita_da_modificare: any;
  dettagli_da_db: any[] = [];
  dettagli_attivita_da_modificare:any[] = [];

  public dettaglio_da_aggiungere: any;
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
  @Input() dettaglio_selezionato:any;
  @Output() chiudi =  new EventEmitter<void>();
  @Output() inviaModifiche = new EventEmitter<any[]>();
  @Output() dettaglio_selezionato_in_attesa = new EventEmitter<number>();


  onDettaglioSelezionato(dettaglio:number) {
    this.dettaglio_selezionato_in_attesa.emit(dettaglio);
  }

  onDettagliInseriti(dettagli:any[]){
    const dettagli_sistemati:any[] = dettagli.map((dettaglio) => {
      if(this.foodBool) {
        return {
          id_dettaglio: dettaglio.id ? dettaglio.id : dettaglio.id_dettaglio,
          quantita: dettaglio.quantita
        }
      } else {
        return {
          id_dettaglio: dettaglio.id ? dettaglio.id : dettaglio.id_dettaglio,
          serie: dettaglio.serie,
          ripetizioni: dettaglio.ripetizioni,
          pesi_kg: dettaglio.pesi_kg,
          riposo_minuti: dettaglio.riposo_minuti
        }
      }
    });
    this.inviaModifiche.emit(dettagli_sistemati);
    this.clickChiudi();
  }

  mettiInLista(dettaglio: any) {
    this.dettaglio_da_aggiungere = dettaglio;
  }

  clickChiudi() {
    this.dettagli_attivita_da_modificare = [];
    this.dettaglio_selezionato = null;

    this.isClosing = true;
    setTimeout(() => {
      this.chiudi.emit();
      this.isClosing = false;
    },400) //durata animazione
  }

}
