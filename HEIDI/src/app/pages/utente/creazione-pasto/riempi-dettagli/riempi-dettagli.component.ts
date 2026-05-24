import { Component, Input, OnInit } from '@angular/core';
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
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol, ReactiveFormsModule, IonInput, IonSelect, IonSelectOption, RouterModule, RiempiDettagliComponent]

})
export class RiempiDettagliComponent  implements OnInit {
  @Input() dettagli:any[] = [];
  @Input() isShow:Boolean = false;
  @Input() id_attivita:Number | undefined;

  public riempiDettagliForm:FormGroup;

  constructor(private formbuilder:FormBuilder, private foodService:GestionePastiService) {

    this.riempiDettagliForm = this.formbuilder.group({
    //per prima cosa passiamo l'id del pasto o dell'allenamento che vogliamo riempire
    id_attivita: [Number, Validators.required],
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
  /*  this.foodService.getAlimenti().subscribe({
      next: (data) => {this.alimenti = data;},
      error: (err) => {console.error(err)}
    });
  */
    //da implementare il caricamento degli esercizi

    this.riempiDettagliForm.reset();
  }

  async submitRiempi(){
    this.isShow = false;
  }
  

}
