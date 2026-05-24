import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { GestionePastiService } from 'src/app/services/pasti/gestione-pasti.service';
import { firstValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-creazione-pasto',
  templateUrl: './creazione-pasto.page.html',
  styleUrls: ['./creazione-pasto.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol, ReactiveFormsModule, IonInput, IonSelect, IonSelectOption, RouterModule]
})
export class CreazionePastoPage implements OnInit {
public alimenti:any[] = [];
public pastoForm:FormGroup;
public riempiPastoForm:FormGroup;
public showAlreadyExistent:Boolean = false;
public showRiempiPasto:Boolean = false;
public expiredSession:Boolean = false;
  

  constructor(private formbuilder:FormBuilder, private foodService:GestionePastiService) {
    this.pastoForm = formbuilder.group({
      nome: ['', Validators.required],
      tipo: ['', Validators.required]
    });

    this.riempiPastoForm = formbuilder.group({
      id_pasto: [Number, Validators.required],
      alimento_0: null,
      qta_0: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      alimento_1: null,
      qta_1: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      alimento_2: null,
      qta_2: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      alimento_3: null,
      qta_3: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      alimento_4: null,
      qta_4: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      alimento_5: null,
      qta_5: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      alimento_6: null,
      qta_6: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      alimento_7: null,
      qta_7: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      alimento_8: null,
      qta_8: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      alimento_9: null,
      qta_9: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      bevanda_0: null,
      qta_b_0: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      bevanda_1: null,
      qta_b_1: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      bevanda_2: null,
      qta_b_2: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      bevanda_3: null,
      qta_b_3: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
      bevanda_4: null,
      qta_b_4: [null, [Validators.pattern(/^\d{0,4}(\.\d{1,2})?$/)]],
    })
   }

  ngOnInit() {
    this.foodService.getAlimenti().subscribe({
      next: (data) => {this.alimenti = data;},
      error: (err) => {console.error(err)}
    });

    this.pastoForm.reset();
    this.riempiPastoForm.reset();

    this.showAlreadyExistent = false;
    this.showRiempiPasto = false;
  }

  async onSubmit() {
    const nomePasto = this.pastoForm.value.nome;
    const dataPasto = this.pastoForm.value.data;
    const tipoPasto = this.pastoForm.value.tipo;

    try {
      const response = await firstValueFrom(this.foodService.checkPasto(nomePasto, tipoPasto));
      if(response && response.exists) {
        this.showAlreadyExistent = true;
        return;
      }
    } catch(e:any) {
      if(e instanceof Error) {
        console.log(e.message);
        return;
      } else if(e.status === 403) {
        this.expiredSession = true;
      } else {
        this.showAlreadyExistent = false;
        this.expiredSession = false;
      }
    }
    //Se non esiste, crea il pasto
    try {
      const response = await firstValueFrom(this.foodService.creaPasti(this.pastoForm.value.nome, this.pastoForm.value.tipo));
      if (response === null) {
        console.log('errore di nullità');
        return
      } else if(response.status === 201) {
        console.log('inserito il pasto correttamente');
        this.showRiempiPasto = true;
        const pastoId = response.body.id;
        this.riempiPastoForm.patchValue({id_pasto: pastoId});
        console.log('passato id al nuovo form:', this.riempiPastoForm.value.id_pasto);
      }
    } catch(e:any) {
      if(e instanceof Error) {
        console.log(e.message);
      }
    }
  }

  async submitRiempi(){
    console.log('submitRiempi chiamata');
    const idPasto = this.riempiPastoForm.value.id_pasto;
    const alimenti = [];
    const bevande = [];
    for(let i = 0; i < 10; i++) {
      const alimento = this.riempiPastoForm.value[`alimento_${i}`];
      const qta = this.riempiPastoForm.value[`qta_${i}`];
      if(alimento && qta) {
        alimenti.push({id: alimento, qta: qta});
      }
    }
    for(let i = 0; i < 5; i++) {
      const bevanda = this.riempiPastoForm.value[`bevanda_${i}`];
      const qta_b = this.riempiPastoForm.value[`qta_b_${i}`];
      if(bevanda && qta_b) {
        bevande.push({id: bevanda, qta: qta_b});
      }
    }
    try {
      const response = await firstValueFrom(this.foodService.riempiPasto(idPasto, alimenti, bevande));
      if(response && response.status === 201) {
        console.log('pasto riempito correttamente');
        this.showRiempiPasto = false;
        this.pastoForm.reset();
        this.riempiPastoForm.reset();
      }
    } catch(e:any) {
      if(e instanceof Error) {
        console.log(e.message);
      } else if(e.status === 403) {
        this.expiredSession = true;
      }
    }
  }

}
