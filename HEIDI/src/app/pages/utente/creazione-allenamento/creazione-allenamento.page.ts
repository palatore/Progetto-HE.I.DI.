import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { IonButtons, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, ViewWillEnter, IonDatetimeButton, IonModal, IonDatetime } from '@ionic/angular/standalone';
import { firstValueFrom } from 'rxjs';
import { RouterModule } from "@angular/router";
import { GestioneAllenamentiService } from "src/app/services/allenamenti/gestione-allenamenti.service";

@Component({
    selector: 'app-creazione-allenamento',
    templateUrl: './creazione-allenamento.page.html',
    styleUrls: ['./creazione-allenamento.page.scss'],
    standalone: true,
    imports: [IonCardTitle, IonModal, IonDatetimeButton, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, RouterModule, IonCard, IonCardHeader, IonCardContent, FormsModule, ReactiveFormsModule, CommonModule, IonGrid, IonRow, IonCol, IonInput, IonDatetime, IonButtons]
})

export class CreazioneAllenamentoPage{
public esercizi: any[] = [];
public allenamentoForm:FormGroup;
public id_allenamento_creato:Number = 0;
public showAlreadyExistent:Boolean = false;
public showRiempiAllenamento:Boolean = false;
public expiredSession:Boolean = false;

    constructor(private formbuilder:FormBuilder, private workoutService:GestioneAllenamentiService){
        this.allenamentoForm = formbuilder.group({
            nome: ['', Validators.required],
            giorno: ['', Validators.required]
        });
    }

    //questo metodo fa sì che al refresh della pagina il form venga resettato
    ionViewWillEnter() {
        this.allenamentoForm.reset();
    }

 
}