import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, ViewWillEnter } from '@ionic/angular/standalone';
import { GestionePastiService } from 'src/app/services/pasti/gestione-pasti.service';
import { firstValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';
import { RiempiDettagliComponent } from "../../../components/riempi-dettagli/riempi-dettagli.component";
import { InfoDettagliComponent } from "src/app/components/info-dettagli/info-dettagli.component";

@Component({
  selector: 'app-creazione-pasto',
  templateUrl: './creazione-pasto.page.html',
  styleUrls: ['./creazione-pasto.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol, ReactiveFormsModule, IonInput, IonSelect, IonSelectOption, RouterModule, RiempiDettagliComponent, InfoDettagliComponent]
})
export class CreazionePastoPage implements OnInit {
public alimenti:any[] = [];
public pastoForm:FormGroup;
public id_pasto_creato:number = 0;
public showAlreadyExistent:Boolean = false;
public showRiempiPasto:Boolean = false;
public expiredSession:Boolean = false;
alimento_selezionato:any = null; //variabile per la gestione delle info
alimento_da_aggiungere:any = null; //variabile per la gestione delle info
  

  constructor(private formbuilder:FormBuilder, private foodService:GestionePastiService) {
    this.pastoForm = formbuilder.group({
      nome: ['', Validators.required],
      tipo: ['', Validators.required]
    });
  }

  //metodo onInit della pagina, carica tramite il servizio gli alimenti disponibili nel database
  //il metodo utilizza la proprietà subscribe degli observable per gestire la risposta del servizio
  ngOnInit() {
    this.foodService.getAlimenti().subscribe({
      next: (data) => {this.alimenti = data;},
      error: (err) => {console.error(err)}
    });
  //in seguito resetta il form e imposta i flag a false per permettere un nuovo inserimento
    this.pastoForm.reset();
    this.showAlreadyExistent = false;
    this.showRiempiPasto = false;
  }

  //questo metodo fa sì che al refresh della pagina il form venga resettato
  ionViewWillEnter() {
    this.pastoForm.reset();
  }

//INSERIMENTO PASTO NEL DATABASE

  //metodo per crare un pasto al submit del form nella pagina html
  async onSubmit() {
    const nomePasto = this.pastoForm.value.nome;
    const tipoPasto = this.pastoForm.value.tipo;

    //ricava i dati inseriti nel form e quindi procede a controllare se esiste già un pasto identico
    //se esiste, ritorna con un messaggio di errore impostato dal flag true
    //se non esiste, procede alla creazione del pasto con i dati inseriti
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
  //dopo aer creato il pasto, imposta il flag per mostrare il component di inserimento dettagli a true
  //il component si attiva tramite il decorator @Input
  //successivamente il metodo conserva l'id del pasto appena creato per poi passarlo successivamente al component
        this.showRiempiPasto = true;
        const pastoId = response.body.id;
        this.id_pasto_creato = pastoId;
      }
    } catch(e:any) {
      if(e instanceof Error) {
        console.log(e.message);
      }
    }
  }

//INSERIMENTO DETTAGLI PASTO

  //metodo per ricevere un alimento dal component di riempimento per mostrarne le info
  onAlimentoSelezionato(id_alimento:number) {
    console.log('Ho ricevuto un alimento da selezionare:', id_alimento);
    this.alimento_selezionato = this.datiAlimento(id_alimento);
  }

  async datiAlimento(id_alimento:number): Promise<any> {
    try {
      const response = await firstValueFrom(this.foodService.getAlimentoById(id_alimento));
      if(response  && response.exists) {
        return response.data;
      }
    } catch (error) {
      console.error('Errore nel recupero dellw info:', error);
    }

  }

  //metodo per inviare i dettagli di un alimento selezionato al component di riempimento pasto
  mettiInLista(cibo: {id: number, qta: number}) {
    this.alimento_selezionato = [{
      ['dettaglio_x']: cibo.id,
      ['qta_x']: cibo.qta
    }];

    this.alimento_selezionato = null;
  }

  //metodo per inserire i dettagli pasto nel database, richiede come parametro l'insieme degli alimenti impostati tramite il component
  async submitRiempi(alimenti:any[]) {
    const idPasto = this.id_pasto_creato
  //dopo aver ricavato l'id del pasto di cui inserire i dettagli, procede con l'inserimento
    try {
      const response = await firstValueFrom(this.foodService.riempiPasto(idPasto, alimenti));
      if(response && response.status === 201) {
        this.pastoForm.reset();      }
    } catch(e:any) {
      if(e instanceof Error) {
        console.log(e.message);
      } else if(e.status === 403) {
        this.expiredSession = true;
      }
    }
  }

  //metodo per chiudere il component di inserimento dettagli pasto
  //questo metodo funziona tramite i decorator @Output nel component
  onChiudi() {
    this.showRiempiPasto = false;
    this.pastoForm.reset();
  }
}
