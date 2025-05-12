import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { GestionePastiService } from 'src/app/services/utente/gestione-pasti.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-creazione-pasto',
  templateUrl: './creazione-pasto.page.html',
  styleUrls: ['./creazione-pasto.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol, ReactiveFormsModule, IonInput, IonSelect, IonSelectOption]
})
export class CreazionePastoPage implements OnInit {
public pastoForm:FormGroup;
  public isShowingForm:boolean = false;
  

  constructor(private formbuilder:FormBuilder, private foodService:GestionePastiService) {
    this.pastoForm = formbuilder.group({
      nome: '',
      data: Date,
      tipo: ''
    });
   }

  ngOnInit() {
  }

  async onSubmit() {
    try {
      const response = await firstValueFrom(this.foodService.creaPasto(this.pastoForm.value.nome, this.pastoForm.value.data, this.pastoForm.value.tipo));
      if (response === null) {
        console.log('errore di nullità');
        return
      } else if(response.status === 201) {
        console.log('inserito il pasto correttamente');
      }
    } catch(e:any) {
      if(e instanceof Error) {
        console.log(e.message);
      }

    }
  }

}
