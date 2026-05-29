import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GestioneAllenamentiService } from "src/app/services/allenamenti/gestione-allenamenti.service";
import { IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonList, IonLabel, IonItem } from "@ionic/angular/standalone";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-allenamenti-utente',
    templateUrl: './allenamenti-utente.page.html',
    styleUrls: ['./allenamenti-utente.page.scss'],
    standalone: true,
    imports: [IonItem, IonLabel, IonList, IonContent, IonButton, IonTitle, IonHeader, IonToolbar, RouterModule, CommonModule ]
})
export class AllenamentiUtentePage implements OnInit{
    constructor(private workoutService:GestioneAllenamentiService){ }

    ngOnInit(){
        this.loadAllenamentiUtente();
    }

    ionViewWillEnter(){
        this.loadAllenamentiUtente();
    }

    allenamentiUtente = [{name: 'Allenamento 1', data_creazione: '1/1/1000', data: '1/1/1000', id: 1},
                        {name: 'Allenamento 2', data_creazione: '1/1/1000', data: '1/1/1000', id: 2},
                        {name: 'Allenamento 3', data_creazione: '1/1/1000', data: '1/1/1000', id: 3}];
    loadAllenamentiUtente(){
        console.log('Caricamento allenamenti utente...');
        this.workoutService.getAllenamentiUtente().subscribe({
            next: (allenamenti) => {
                this.allenamentiUtente = allenamenti;
                console.log('Allenamenti caricati:', this.allenamentiUtente);
            },
            error: (err) => {
                console.error('Errore nel caricamento degli allenamenti:', err);
            }
        });
    }
}