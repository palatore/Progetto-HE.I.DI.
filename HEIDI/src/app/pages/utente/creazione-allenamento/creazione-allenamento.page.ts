import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { IonButtons, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, ViewWillEnter, IonDatetimeButton, IonModal, IonDatetime } from '@ionic/angular/standalone';
import { firstValueFrom } from 'rxjs';
import { RouterModule } from "@angular/router";
import { GestioneAllenamentiService } from "src/app/services/allenamenti/gestione-allenamenti.service";
import { RiempiDettagliComponent } from "src/app/components/riempi-dettagli/riempi-dettagli.component";
import { InfoDettagliComponent } from "src/app/components/info-dettagli/info-dettagli.component";

@Component({
    selector: 'app-creazione-allenamento',
    templateUrl: './creazione-allenamento.page.html',
    styleUrls: ['./creazione-allenamento.page.scss'],
    standalone: true,
    imports: [IonCardTitle, IonModal, IonDatetimeButton, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, RouterModule, IonCard, IonCardHeader, IonCardContent, FormsModule, ReactiveFormsModule, CommonModule, IonGrid, IonRow, IonCol, IonInput, IonDatetime, IonButtons, RiempiDettagliComponent, InfoDettagliComponent]
})

export class CreazioneAllenamentoPage implements OnInit{
public esercizi: any[] = [];
public allenamentoForm:FormGroup;
public id_allenamento_creato:number = 0;
public showAlreadyExistent:Boolean = false;
public showRiempiAllenamento:Boolean = false;
public expiredSession:Boolean = false;
esercizio_selezionato:any = null //variabile per la gestione delle info
esercizio_da_aggiungere:any = null //variabile per la gestione delle info

    constructor(private formbuilder:FormBuilder, private workoutService:GestioneAllenamentiService){
        this.allenamentoForm = formbuilder.group({
            nome: ['', Validators.required],
            giorno: ['', Validators.required]
        });
    }

    //metodo onInit della pagina, carica tramite il servizio gli esercizi disponibili nel database
    //il metodo utilizza la proprietà subscribe degli observable per gestire la risposta del servizio
    ngOnInit() {
        this.workoutService.getEsercizi().subscribe({
            next: (data) => {this.esercizi = data;},
            error: (err) => {console.error(err)}
        });
        //adesso resetta il form e imposta il flag a false per permettere un nuovo inserimento
        this.allenamentoForm.reset();
        this.showAlreadyExistent = false;
        this.showRiempiAllenamento = false;
    }

    //questo metodo fa sì che al refresh della pagina il form venga resettato
    ionViewWillEnter() {
        this.allenamentoForm.reset();
    }

    
    //INSERIMENTO ALLENAMENTO DEL DB
    async onSubmit(){
        const nomeAllenamento = this.allenamentoForm.value.nome;
        const giornoAllenamento = this.allenamentoForm.value.giorno.split('T')[0];
        //grazie al metodo split() posso trasformare il formato della data da YYYY-MM-dd T ore:minuti
        //al formato YYYY-MM-DD, escludendo così l'informazione sull'orario
        console.log('Giorno letto:', giornoAllenamento);
        console.log('giorno è di tipo:', typeof(giornoAllenamento));

        //ricava i dati inseriti nel form e quindi procede a controllare se esiste già un allenamento nello stesso giorno
    //se esiste, ritorna con un messaggio di errore impostato dal flag true
    //se non esiste, procede alla creazione dell'allenamento con i dati inseriti
    try {
        const response = await firstValueFrom(this.workoutService.checkAllenamento(giornoAllenamento));
        console.log('Nel TS leggo:', giornoAllenamento);
        if(response && response.exists){
            this.showAlreadyExistent = true;
            return;
        }
    } catch(e:any){
        if(e instanceof Error){
            console.log(e.message);
            return;
        }else if(e.status === 403){
            this.expiredSession = true;
        }else{
            this.showAlreadyExistent = false;
            this.expiredSession = false;
        }
    }
        //se non esiste, crea l'allenamento
        try{
            const response = await firstValueFrom(this.workoutService.creaAllenamenti(nomeAllenamento, giornoAllenamento));
            if(response === null){
                console.log('errore di nullità');
                return
            }else if(response.status === 201){
                console.log('allenamento creato con id:', response.body.id);
                //dopo aer creato l'allenamento, imposta il flag per mostrare il component di inserimento dettagli a true
                //il component si attiva tramite il decorator @Input
                //successivamente il metodo conserva l'id dell'allenamento appena creato per poi passarlo successivamente al component
                this.showRiempiAllenamento = true;
                const allenamentoId = response.body.id;
                this.id_allenamento_creato = allenamentoId;
            }
        } catch(e:any){
            if(e instanceof Error){
                console.log(e.message);
            }
        }
    }
//INSERIMENTO DETTAGLI ALLENAMENTO
    //metodo per ricevere un esercizio dal component di riempimento per mostrarne le info
    async onEsercizioSelezionato(id_esercizio:number){
        console.log('Ho ricevuto un esercizio da selezionare:', id_esercizio);
        this.esercizio_selezionato = await this.datiEsercizio(id_esercizio);
    }
    //metodo per ricavare i dati di un esercizio passato dal component di riempimento
    //il component passa l'id e si cercano i dati corrispondenti
    //le info ottenute vengono inviate al component di visualizzazione info tramite @Input
    async datiEsercizio(id_esercizio:number): Promise<any> {
        try {
            const response = await firstValueFrom(this.workoutService.getEsercizioById(id_esercizio));
            if(response) {
                return response;
            } else {
                console.log('Esercizio non trovato con id:', id_esercizio);
            }
        }catch (error){
            console.error('Errore nel recupero delle info:', error);
        }
    } 

    //metodo per inviare un esercizio al component di riempi pasto
    async mettiInLista(esercizio: {id_esercizio:number, serie:number}) {
        const workout = await this.datiEsercizio(esercizio.id_esercizio);
        this.esercizio_da_aggiungere = [{
            esercizio: workout,
            serie: esercizio.serie
        }];
        console.log('Debug: esercizio da aggiungere:', this.esercizio_da_aggiungere);

        this.esercizio_selezionato = null;
    }

    //metodo per inserire i dettagli allenamento nel db, richiede come parametro l'insieme degli esercizi impostati tramite il component
    async submitRiempi(esercizi:any[]){
        const idAllenamento = this.id_allenamento_creato;
        //id allenamento ricavato, ora inseriamolo
        try {
            const response = await firstValueFrom(this.workoutService.riempiAllenamento(idAllenamento, esercizi));
            if (response && response.status === 201){
                this.allenamentoForm.reset();
            }
        }catch(e:any){
            if(e instanceof Error){
                console.log(e.message);
            } else if(e.status === 403) {
                this.expiredSession = true;
            }
        }
    }

    //metodo per chiudere il component di inserimento dettagli allenamento
    //funziona grazie i decorator @Output nel component
    onChiudi(){
        this.showRiempiAllenamento = false;
        this.allenamentoForm.reset();
    }
}