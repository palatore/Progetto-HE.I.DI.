import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonInput, IonItem, IonRow, IonSelect, IonSelectOption, IonCardTitle } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { GestionePastiService } from 'src/app/services/pasti/gestione-pasti.service';
import { firstValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';
import { RiempiDettagliComponent } from "../../../components/riempi-dettagli/riempi-dettagli.component";
import { InfoDettagliComponent } from "src/app/components/info-dettagli/info-dettagli.component";
import { DefaultHeaderComponent } from "src/app/components/default-header/default-header.component";

@Component({
  selector: 'app-creazione-pasto',
  templateUrl: './creazione-pasto.page.html',
  styleUrls: ['./creazione-pasto.page.scss'],
  standalone: true,
  imports: [IonCardTitle, IonContent, CommonModule, FormsModule, IonButton, IonItem, IonCard, IonCardContent, IonCardHeader, IonGrid, IonRow, IonCol, ReactiveFormsModule, IonInput, IonSelect, IonSelectOption, RouterModule, RiempiDettagliComponent, InfoDettagliComponent, DefaultHeaderComponent]
})
export class CreazionePastoPage implements OnInit {
public page_title:string = 'Creazione Pasto';
public alimenti:any[] = [];
public pastoForm:FormGroup;
public id_pasto_creato:number = 0;
public showAlreadyExistent:boolean = false;
public showRiempiPasto:boolean = false;
public expiredSession:boolean = false;
public alimento_selezionato:any = null; //variabile per la gestione delle info
public alimento_da_aggiungere:any = null; //variabile per la gestione delle info
  

  constructor(private formbuilder:FormBuilder, private foodService:GestionePastiService, private alertController: AlertController) {
    this.pastoForm = formbuilder.group({
      nome: new FormControl({value: '', disabled: false}, Validators.required),
      tipo: new FormControl({value: '', disabled: false}, Validators.required)
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
    this.showRiempiPasto = false;
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
      }
    }
  //Se non esiste, crea il pasto
    try {
      const data_creazione:string = new Date().toISOString();
      const response = await firstValueFrom(this.foodService.creaPasti(this.pastoForm.value.nome, this.pastoForm.value.tipo, data_creazione));
      if (response === null) {
        console.log('errore di nullità');
        return
      } else if(response.status === 201) {
  //dopo aver creato il pasto, imposta il flag per mostrare il component di inserimento dettagli a true
  //il component si attiva tramite il decorator @Input
  //successivamente il metodo conserva l'id del pasto appena creato per poi passarlo successivamente al component
      const pastoId = response.body.id;
      this.id_pasto_creato = pastoId;
      this.showRiempiPasto = true;
      this.pastoForm.get('nome')?.disable();
      this.pastoForm.get('tipo')?.disable();
      }
    } catch(e:any) {
      if(e instanceof Error) {
        console.log(e.message);
      }
    }
  }

  async annullaCreazione() {
    try {
      const response = await firstValueFrom(this.foodService.eliminaPasto(this.id_pasto_creato));
      if(response && response.status === 201) {
        const alert = await this.alertController.create({
          header: 'Pasto annullato',
          message: 'Hai annullato questo pasto',
          buttons: ['OK']
        });
        await alert.present();
        this.pastoForm.get('nome')?.enable();
        this.pastoForm.get('tipo')?.enable();
      }
    } catch(e:any) {
      if(e instanceof Error) {
        console.log(e.message);
      } else if(e.status === 403) {
        this.expiredSession = true;
      }
    }
    this.showRiempiPasto = false;
    this.pastoForm.reset();
  }

//INSERIMENTO DETTAGLI PASTO

  //metodo per ricevere un alimento dal component di riempimento per mostrarne le info
  async onAlimentoSelezionato(id_alimento:number) {
    this.alimento_selezionato = await this.datiAlimento(id_alimento);
  }

  //metodo per ricavare i dati di un alimento passato dal component di riempimento
  //il component passa l'id e si cercano i dati corrispondenti
  //le info ottenute vengono inviate al component di visualizzazione info tramite @Input
  async datiAlimento(id_alimento:number): Promise<any> {
    try {
      const response = await firstValueFrom(this.foodService.getAlimentoById(id_alimento));
      if(response) {
        return response;
      } else {
        console.log('Alimento non trovato per id:', id_alimento);
      }
    } catch (error) {
      console.error('Errore nel recupero delle info:', error);
    }

  }

  //metodo per inviare un alimento di cui si è visualizzate le info e selezionato al component di riempimento pasto
  mettiInLista(alimento: {id_dettaglio:number, name:string, quantita:number}) {
    this.alimento_da_aggiungere = alimento;
  }

  //metodo per inserire i dettagli pasto nel database, richiede come parametro l'insieme degli alimenti impostati tramite il component
  async submitRiempi(alimenti:any[]) {
    const idPasto = this.id_pasto_creato
  //dopo aver ricavato l'id del pasto di cui inserire i dettagli, procede con l'inserimento
    try {
      const response = await firstValueFrom(this.foodService.riempiPasto(idPasto, alimenti));
      if(response && response.status === 201) {
        const alert = await this.alertController.create({
          header: 'Fatto!',
          message: 'Hai creato questo pasto',
          buttons: ['OK']
        });
        await alert.present();
        this.showRiempiPasto = false;
        this.id_pasto_creato = 0;
        this.pastoForm.reset();
        this.pastoForm.get('nome')?.enable();
        this.pastoForm.get('tipo')?.enable();     
      }
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
