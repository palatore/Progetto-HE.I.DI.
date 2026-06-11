import { Component, Input, Output, OnInit, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonButton, IonCard, IonCardHeader, IonCardContent, IonCol, IonGrid, IonInput, IonRow, IonCardTitle } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-riempi-dettagli',
  templateUrl: './riempi-dettagli.component.html',
  styleUrls: ['./riempi-dettagli.component.scss'],
  imports: [CommonModule, FormsModule, IonButton, IonCard, IonCardHeader, IonCardContent, IonGrid, IonRow, IonCol, ReactiveFormsModule, IonInput, RouterModule, IonCardTitle]

})
export class RiempiDettagliComponent  implements OnInit, OnChanges {
  private id_attivita:number | undefined;
  public dettagli:any[] = [];
  private dettagli_completi:any[] = [];
  public dettagli_inseriti:any[] = [];
  public durata_allenamento:number = 0;

  @Input()
    set miei_dettagli(value:any[]) {
      this.dettagli = value;
      this.dettagli_completi = [...value]; //copia per filtrare senza modificare
    }
    get miei_dettagli():any[] {
      return this.dettagli;
    }
  @Input() isShow:boolean = false; //flag per mostrare o nascondere il componente
  @Input() foodBool:boolean = false;  //flag per distinguere se mostrare la parte relataiva agli alimenti o, se falsa, quella relativa agli esercizi
  @Input() 
    //Quando riceve un nuovo id attività lo assegna nel form
    set new_id_attivita(value:number | undefined) {
      this.id_attivita = value;
    }
    get new_id_attivita():number | undefined {
      return this.id_attivita;
    }
  @Input() dettagli_aggiunti_da_info:any;
  @Output() dettaglioSelezionato = new EventEmitter<number>();
  @Output() chiudi = new EventEmitter<void>();
  @Output() dettagliInseriti = new EventEmitter<any[]>();


  constructor() {
  }

  ngOnInit() {
  }

  dettaglioTrack(index: number, dettaglio: any):string {
    return `${index}-${dettaglio.id_dettaglio}-${dettaglio.name}-${dettaglio.pesi_kg}-${dettaglio.qta}-${dettaglio.ripetizioni}-${dettaglio.riposo}-${dettaglio.serie}`;
  }

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

  onImgError(event: any) {
    if (this.foodBool) {
      event.target.src = 'assets/dettagli/default.png';
    } else {
      event.target.src = 'assets/dettagli/defaultWorkout.png';
    }
  }

  filtraDettagli(event: any) {
    const filtro = event.target.value.toLowerCase(); //prende l'input e lo rende minuscolo per cercare corrispondenze
    if (!filtro) {
      this.dettagli = [...this.dettagli_completi];
    } else {
      this.dettagli = this.dettagli_completi.filter(dettaglio => dettaglio.name.toLowerCase().includes(filtro));
    }
  }

  //emette il dettaglio selezionato al genitore per mostrarne le info tramite il componente di info
  segnaDettaglio(id_dettaglio:number) {
    console.log('Dettaglio selezionato:', id_dettaglio);
    this.dettaglioSelezionato.emit(id_dettaglio);
  }

  ngOnChanges(changes: SimpleChanges) {
    //ogni volta che non viene più mostrato, resetta la tabella
    if(changes['isShow'] && !changes['isShow'].currentValue) {
      this.dettagli_inseriti = [];
    }
    //se riceve nuovi dettagli da info li aggiunge alla lista dei dettagli insieriti nel pasto o allenamento
    if(changes['dettagli_aggiunti_da_info']) {
      const nuovi_dettagli = changes['dettagli_aggiunti_da_info'].currentValue;
      console.log('Ricevuti nuovi dettagli da inserire dal component di info:', nuovi_dettagli);
      if(nuovi_dettagli) {
        this.dettagli_inseriti.push(nuovi_dettagli);
      } else {
        console.log('Debug: nessun nuovo dettaglio o dettaglio vuoto');
      }
    }
  }

  submitRiempi(){
    this.dettagliInseriti.emit(this.dettagli_inseriti);
    this.dettagli_inseriti = [];
    this.chiudi.emit(); 
  }
  

}
