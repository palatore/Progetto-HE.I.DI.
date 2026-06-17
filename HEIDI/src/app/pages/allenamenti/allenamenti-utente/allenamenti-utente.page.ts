import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GestioneAllenamentiService } from "src/app/services/allenamenti/gestione-allenamenti.service";
import { IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonList, IonLabel, IonItem, IonIcon, IonCard, IonCardTitle, IonCardHeader, IonCardContent } from "@ionic/angular/standalone";
import { RouterModule } from "@angular/router";
import { ModificaDettagliComponent } from "src/app/components/modifica-dettagli/modifica-dettagli.component";
import { firstValueFrom } from "rxjs/internal/firstValueFrom";
import { Allenamento } from "src/app/models/allenamento.model";

@Component({
    selector: 'app-allenamenti-utente',
    templateUrl: './allenamenti-utente.page.html',
    styleUrls: ['./allenamenti-utente.page.scss'],
    standalone: true,
    imports: [IonCardContent, IonCardHeader, IonCardTitle, IonCard, IonIcon, IonItem, IonLabel, IonList, IonContent, IonButton, IonTitle, IonHeader, IonToolbar, RouterModule, CommonModule, ModificaDettagliComponent ]
})
export class AllenamentiUtentePage implements OnInit{

    public viewModifica:boolean = false;
    public esercizi:any[] = [];

    constructor(private workoutService:GestioneAllenamentiService){ }

    ngOnInit(){
        this.loadAllenamentiUtente();
        this.loadEsercizi();
    }

    ionViewWillEnter(){
        this.loadAllenamentiUtente();
    }

    public allenamentoSelezionato: any = null;
    public allenamento_da_modificare: any = null;
    public esercizioSelezionato:any = null;
    public dettagliAllenamento: any = null; // Variabile per i dettagli dell'allenamento selezionato


    async mostraDettagli(allenamento: any) {
        this.allenamentoSelezionato = allenamento;
        this.dettagliAllenamento = null; // Resetta i dettagli dell'allenamento selezionato
        //Effettua una chiamata al servizio per ottenere i dettagli dell'allenamento selezionato
        try {
            this.dettagliAllenamento = await firstValueFrom(this.workoutService.getDettagliAllenamento(allenamento.id));
            console.log('Dettagli dell\'allenamento:', this.dettagliAllenamento);
        } catch (error) {
            console.error('Errore nel caricamento dei dettagli dell\'allenamento:', error);
        }
    }

    allenamentoTrack(index: number, allenamento: any):string {
        return `${allenamento.name}-${allenamento.data}-${allenamento.data_creazione}`;
    }

    esercizioTrack(index: number, esercizio: any):string {
        return `${esercizio.name} - ${esercizio.serie} - ${esercizio.ripetizioni} - ${esercizio.pesi_kg} - ${esercizio.riposo_minuti}`;
    }

    async getEsercizio(id_esercizio:number){
        console.log('Ricevuto id da cercare:', id_esercizio);
        this.esercizioSelezionato = await this.datiEsercizio(id_esercizio);
    }

    async datiEsercizio(id_esercizio:number): Promise<any> {
        try {
            const response = await firstValueFrom(this.workoutService.getEsercizioById(id_esercizio));
            if(response) {
                console.log('trovato:', response);
                return response;
            }
        } catch (error:any) {
            if(error instanceof Error) {
                console.error(error.message);
                return;
            }else if(error.status == 404){
                console.log('Esercizio non trovato per id:', id_esercizio);
                this.esercizioSelezionato = null;
            }
        }    
    }

    chiudiDettagli() {
        this.allenamentoSelezionato = null;
    }

    async modificaAllenamento(allenamento: any) {
        try {
            this.dettagliAllenamento = await firstValueFrom(this.workoutService.getDettagliAllenamento(allenamento.id));
            console.log('Dettagli dell\'allenamento da modificare:', this.dettagliAllenamento);
        } catch (err){
            console.log(err);
        }
        this.allenamento_da_modificare = allenamento;
        console.log('Allenamento da modificare:', this.allenamento_da_modificare);
        this.viewModifica = true;
    }

    async confermaModificaAllenamento(modifiche: any[]) {
        try {
            const id_allenamento_modificato = this.allenamento_da_modificare.id;
            const response = await firstValueFrom(this.workoutService.modificaAllenamento(id_allenamento_modificato, modifiche));
            console.log('Allenamento modificato con successo:', response);
            //Ricarica gli allenamenti dopo la modifica
            this.loadAllenamentiUtente();
        } catch (e) {
            console.error('Errore nella modifica dell\'allenamento:', e);
        }
    }

    async eliminaAllenamento(id: number){
        try{
            const response = await firstValueFrom(this.workoutService.eliminaAllenamento(id));
            console.log('Allenamento eliminato con successo:', response);
            //ricarica la lista degli allenamenti dopo l'eliminazione
            this.loadAllenamentiUtente();
        } catch(e){
            console.error('Errore nell\'eliminazione dell\'allenamento:', e);
        }
    }
    
    onChiudi() {
        this.viewModifica = false;
    }

    allenamentiUtente:Allenamento[] = [];
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

    loadEsercizi() {
        this.workoutService.getEsercizi().subscribe({
            next: (data) => {this.esercizi = data;
                console.log('Esercizi caricati:', this.esercizi);
            },
            error: (err) => {console.error(err);}
        });
    }
}