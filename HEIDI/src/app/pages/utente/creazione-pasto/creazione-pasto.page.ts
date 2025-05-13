import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { GestionePastiService } from 'src/app/services/utente/gestione-pasti.service';
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
public pastoForm:FormGroup;
public showAlreadyExistent:Boolean = false;
public showRiempiPasto:Boolean = false;
  

  constructor(private formbuilder:FormBuilder, private foodService:GestionePastiService) {
    this.pastoForm = formbuilder.group({
      nome: '',
      data: '',
      tipo: ''
    });
   }

  ngOnInit() {
  }

  async onSubmit() {
    const nomePasto = this.pastoForm.value.nome;
    const dataPasto = this.pastoForm.value.data;
    const tipoPasto = this.pastoForm.value.tipo;


    try {
      const response = await firstValueFrom(this.foodService.checkPasto(nomePasto, dataPasto, tipoPasto));
      if(response === null) {
        console.log('errore di nullità');
        return;
      } else if(response && response.exists) {
        this.showAlreadyExistent = true;
        return;
      }
    } catch(e:any) {
      if(e instanceof Error) {
        console.log(e.message);
        return;
      }
    }
    //Se non esiste, crea il pasto
    try {
      const response = await firstValueFrom(this.foodService.creaPasto(this.pastoForm.value.nome, this.pastoForm.value.data, this.pastoForm.value.tipo));
      if (response === null) {
        console.log('errore di nullità');
        return
      } else if(response.status === 201) {
        console.log('inserito il pasto correttamente');
        this.showRiempiPasto = true;
      }
    } catch(e:any) {
      if(e instanceof Error) {
        console.log(e.message);
      }

    }
  }

}
