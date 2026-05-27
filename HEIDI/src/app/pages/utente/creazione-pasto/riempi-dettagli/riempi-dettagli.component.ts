import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { GestionePastiService } from 'src/app/services/pasti/gestione-pasti.service';
import { firstValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-riempi-dettagli',
  templateUrl: './riempi-dettagli.component.html',
  styleUrls: ['./riempi-dettagli.component.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol, ReactiveFormsModule, IonInput, IonSelect, IonSelectOption, RouterModule]

})
export class RiempiDettagliComponent  implements OnInit {
  private id_attivita:number | undefined;
  public dettagli:any[] = [];
  private dettagli_completi:any[] = [];

  @Input()
    set miei_dettagli(value:any[]) {
      this.dettagli = value;
      this.dettagli_completi = [...value]; //copia per filtrare senza modificare
    }
    get miei_dettagli():any[] {
      return this.dettagli;
    }
  @Input() isShow:Boolean = false;
  @Input() 
    //Quando riceve un nuovo id attività lo assegna nel form
    set new_id_attivita(value:number | undefined) {
      this.id_attivita = value;
      if (value) {
        this.riempiDettagliForm.patchValue({id_attivita: value});
        console.log('id_attivita aggiornato in riempi dettagli:', this.riempiDettagliForm.value.id_attivita);
      }
    }
    get new_id_attivita():number | undefined {
      return this.id_attivita;
    }
  @Output() chiudi = new EventEmitter<void>();
  @Output() dettagliInseriti = new EventEmitter<any[]>();

  public riempiDettagliForm:FormGroup;

  constructor(private formbuilder:FormBuilder, private foodService:GestionePastiService) {

    this.riempiDettagliForm = this.formbuilder.group({
      //per prima cosa passiamo l'id del pasto o dell'allenamento che vogliamo riempire
      id_attivita: [null, Validators.required],
      dettaglio_0: null, //questo può essere un alimento o un esercizio in base a cosa vuole costruire l'utente
      qta_0: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      dettaglio_1: null,
      qta_1: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      dettaglio_2: null,
      qta_2: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      dettaglio_3: null,
      qta_3: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      dettaglio_4: null,
      qta_4: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      dettaglio_5: null,
      qta_5: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      dettaglio_6: null,
      qta_6: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      dettaglio_7: null,
      qta_7: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      dettaglio_8: null,
      qta_8: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      dettaglio_9: null,
      qta_9: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
    });
  }

  ngOnInit() {
  }

  getImgPath(dettaglio:any): string {
    const parametro = dettaglio.name.toLowerCase().replace(/\s/g, '_');
    const imgPath = `assets/dettagli/${parametro}.png`;
    return imgPath;
  }
  onImgError(event: any) {
  event.target.src = 'assets/dettagli/default.png';
  }

  filtraDettagli(event: any) {
    const filtro = event.target.value.toLowerCase(); //prende l'input e lo rende minuscolo per cercare corrispondenze
    if (!filtro) {
      this.dettagli = [...this.dettagli_completi];
    } else {
      this.dettagli = this.dettagli_completi.filter(dettaglio => dettaglio.name.toLowerCase().includes(filtro));
    }
  }

  //con questa funzione, cliccando sul dettaglio questo viene aggiunto al form dettagli
  segnaDettaglio(id_dettaglio:Number) {
    //per prima cosa trova un posto libero
    for(let i = 0; i < 10; i++) {
      if (!this.riempiDettagliForm.value[`dettaglio_${i}`]) {
        this.riempiDettagliForm.patchValue({[`dettaglio_${i}`]: id_dettaglio, [`qta_${i}`]: 1});
        break;
      }
    }
  }

  submitRiempi(){
    const dettagli_inseriti = [];
    for(let i = 0; i < 10; i++) {
      const dettaglio = this.riempiDettagliForm.value[`dettaglio_${i}`];
      const qta = this.riempiDettagliForm.value[`qta_${i}`];
      if(dettaglio && qta) {
        dettagli_inseriti.push({id: dettaglio, qta: qta});
      }
    }
    this.dettagliInseriti.emit(dettagli_inseriti);
    this.chiudi.emit();
    this.riempiDettagliForm.reset();
  }
  

}
