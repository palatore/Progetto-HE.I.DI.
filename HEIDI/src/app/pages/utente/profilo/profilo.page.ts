import { Component, OnInit } from '@angular/core';
import { AlertController, IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonIcon, IonCardTitle, IonItem, IonLabel, IonInput } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { GestioneUtentiService } from 'src/app/services/utenti/gestione-utenti.service';
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { addIcons } from 'ionicons';
import { create, close, checkmark } from 'ionicons/icons';

@Component({
  selector: 'app-profilo',
  templateUrl: './profilo.page.html',
  styleUrls: ['./profilo.page.scss'],
  standalone: true,
  imports: [IonInput, IonLabel, IonItem, IonCardTitle, IonIcon, IonCardHeader, IonCard, IonRow, IonGrid, IonContent, IonButton, IonTitle, IonToolbar, IonHeader, RouterLink, IonCol]
})
export class ProfiloPage implements OnInit{
public dati_utente:{id:number, name:string, surname:string, email:string} = {id:-1, name:"", surname:"", email:""};
public info_utente:{eta:number, peso_kg:number, altezza_cm:number, condizioni_mediche:string} = {eta:0, peso_kg:0, altezza_cm:0, condizioni_mediche:""};
public id_utente:number = -1;
public flag_eta:boolean = false;
public flag_peso:boolean = false;
public flag_altezza:boolean = false;
public flag_condizioni:boolean = false;
public eta:number = 0;

    constructor(private utenteService: GestioneUtentiService, private alertController: AlertController) {
    }

    ngOnInit() {
        this.loadDatiUtente();
        addIcons({ create, close, checkmark });

    }

    ionViewWillEnter() {
        this.loadDatiUtente();
    }

   async loadDatiUtente(){
    const decoded = jwtDecode(localStorage.getItem('token') ?? '') as any;
        this.id_utente = decoded.id;
        this.dati_utente = await firstValueFrom(this.utenteService.getUtenteById(this.id_utente));
        this.info_utente = await firstValueFrom(this.utenteService.getInfoUtenteById(this.id_utente));
   }

   modificaEta(){
    this.flag_eta = true;
   }
   modificaPeso(){
    this.flag_peso = true;
   }
   modificaAltezza(){
    this.flag_altezza = true;
   }
   modificaCondizioni(){
    this.flag_condizioni = true;
   }


   async Submit(age:string | number, weight:string | number, height:string | number, condition:string | number){
    if(Number(age) != 0){
        this.info_utente.eta = Number(age);
    }else if(Number(weight) != 0){
        this.info_utente.peso_kg = Number(weight);
    }else if(Number(height) != 0){
        this.info_utente.altezza_cm = Number(height);
    }else if(condition != ""){
        this.info_utente.condizioni_mediche = String(condition);
    }else{
        this.flag_eta = false;
        this.flag_peso = false;
        this.flag_altezza = false;
        this.flag_condizioni = false;
        return;
    }
    try{
        const creato = await firstValueFrom(this.utenteService.creaInfo());
        if(creato === null){
            console.log('errore di nullità');
            return
        }else if(creato.status === 201){
            console.log('Info inserite con successo');
        }
        const riempito = await firstValueFrom(this.utenteService.riempiInfo(this.info_utente));
        if(riempito === null){
            console.log('errore di nullità');
            return
        }else if(riempito.status === 201){
            const alert = await this.alertController.create({
                header: 'Informazione aggiornata',
                message: 'Le tue informazioni sono state aggiornate',
                buttons: ['OK']
            });
            await alert.present();
        }
    }catch(e:any){
        if(e instanceof Error){
            console.log(e.message);
        }
    }
    this.flag_eta = false;
    this.flag_peso = false;
    this.flag_altezza = false;
    this.flag_condizioni = false;
   }

   numeriEta(event: KeyboardEvent){
    const input = event.target as HTMLIonTextareaElement;
    const valore = input.value ?? '';
    if(!/^\d$/.test(event.key) || valore.length >=2){
        event.preventDefault();
    }
   }
   
   numeriPesoAltezza(event: KeyboardEvent){
    const input = event.target as HTMLIonTextareaElement;
    const valore = input.value ?? '';
    if(!/^\d$/.test(event.key) || valore.length >=3){
        event.preventDefault();
    }
    }
       
}