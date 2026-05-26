import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, ViewWillEnter } from '@ionic/angular/standalone';
import { firstValueFrom } from 'rxjs';
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-creazione-allenamento',
    templateUrl: './creazione-allenamento.page.html',
    styleUrls: ['./creazione-allenamento.page.scss'],
    standalone: true,
    imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, RouterModule, IonCard, IonCardHeader, IonCardContent, FormsModule, ReactiveFormsModule, CommonModule, IonGrid, IonRow, IonCol, IonInput]
})

export class CreazioneAllenamentoPage{
public esercizi: any[] = [];
public allenamentoForm:FormGroup;
public id_allenamento_creato:Number = 0;
public showAlreadyExistent:Boolean = false;
public showRiempiAllenamento:Boolean = false;
public expiredSession:Boolean = false;

    constructor(private formbuilder:FormBuilder){
        this.allenamentoForm = formbuilder.group({

        });
    }
}