import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, ViewWillEnter } from '@ionic/angular/standalone';
import { GestionePastiService } from 'src/app/services/pasti/gestione-pasti.service';
import { firstValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';
import { RiempiDettagliComponent } from "./riempi-dettagli/riempi-dettagli.component";

@Component({
  selector: 'app-creazione-pasto',
  templateUrl: './creazione-pasto.page.html',
  styleUrls: ['./creazione-pasto.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol, ReactiveFormsModule, IonInput, IonSelect, IonSelectOption, RouterModule, RiempiDettagliComponent]
})
export class CreazionePastoPage implements OnInit {
public alimenti:any[] = [];
public pastoForm:FormGroup;
public id_pasto_creato:Number | undefined;
public showAlreadyExistent:Boolean = false;
public showRiempiPasto:Boolean = false;
public expiredSession:Boolean = false;
  

  constructor(private formbuilder:FormBuilder, private foodService:GestionePastiService) {
    this.pastoForm = formbuilder.group({
      nome: ['', Validators.required],
      tipo: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.foodService.getAlimenti().subscribe({
      next: (data) => {this.alimenti = data;},
      error: (err) => {console.error(err)}
    });

    this.pastoForm.reset();
    this.showAlreadyExistent = false;
    this.showRiempiPasto = false;
  }

  ionViewWillEnter() {
    this.pastoForm.reset();
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
        this.id_pasto_creato = pastoId;
        console.log('id pasto creato:', this.id_pasto_creato);
      }
    } catch(e:any) {
      if(e instanceof Error) {
        console.log(e.message);
      }
    }
  }

  async submitRiempi(){
  /*  console.log('submitRiempi chiamata');
    const idPasto = this.id_pasto_creato
    const alimenti = [];
    for(let i = 0; i < 10; i++) {
      const alimento = this.riempiPastoForm.value[`alimento_${i}`];
      const qta = this.riempiPastoForm.value[`qta_${i}`];
      if(alimento && qta) {
        alimenti.push({id: alimento, qta: qta});
      }
    }
    try {
      const response = await firstValueFrom(this.foodService.riempiPasto(idPasto, alimenti));
      if(response && response.status === 201) {
        console.log('pasto riempito correttamente');
        this.showRiempiPasto = false;
        this.pastoForm.reset();      }
    } catch(e:any) {
      if(e instanceof Error) {
        console.log(e.message);
      } else if(e.status === 403) {
        this.expiredSession = true;
      }
    } */
  }

  onChiudi() {
    this.submitRiempi();
    this.showRiempiPasto = false;
    this.pastoForm.reset();
    console.log('debug: pasto riempito e chiuso');
  }
}
