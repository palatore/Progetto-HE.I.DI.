import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonIcon, IonCardTitle, IonItem, IonLabel, IonInput, IonButtons, IonMenuButton, IonModal, IonCardContent } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { GestioneUtentiService } from 'src/app/services/utenti/gestione-utenti.service';
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { addIcons } from 'ionicons';
import { create, close, checkmark } from 'ionicons/icons';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators, FormControl, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profilo',
  templateUrl: './profilo.page.html',
  styleUrls: ['./profilo.page.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, IonCardContent, IonModal, IonButtons, IonMenuButton,IonInput, IonLabel, IonItem, IonCardTitle, IonIcon, IonCardHeader, IonCard, IonRow, IonGrid, IonContent, IonButton, IonTitle, IonToolbar, IonHeader, RouterLink, IonCol]
})
export class ProfiloPage implements OnInit{
public dati_utente:{id:number, name:string, surname:string, email:string, password:string, ruolo:number, id_P1:number, id_P2:number} = {id:-1, name:"", surname:"", email:"", password:"", ruolo:0, id_P1:-1, id_P2:-1};
public info_utente:{eta:number, peso_kg:number, altezza_cm:number, condizioni_mediche:string} = {eta:0, peso_kg:0, altezza_cm:0, condizioni_mediche:""};
public dati_esperto_alimentare:{id:number, name:string, surname:string, email:string, ruolo:number} = {id:-1, name:"", surname:"", email:"", ruolo:0};
public dati_esperto_allenamenti:{id:number, name:string, surname:string, email:string, ruolo:number} = {id:-1, name:"", surname:"", email:"", ruolo:0};
public id_utente:number = -1;
public flag_eta:boolean = false;
public flag_peso:boolean = false;
public flag_altezza:boolean = false;
public flag_condizioni:boolean = false;
public passwordForm:FormGroup;
public modalOpen:boolean = false;
public controlloVecchiaPassword:boolean = false;
public controlloNuovaPassword:boolean = false;

    constructor(private formbuilder: FormBuilder, private utenteService: GestioneUtentiService, private alertController: AlertController) {
        this.passwordForm = formbuilder.group({
            vecchiaPassword: new FormControl({value:'', disabled:false}, Validators.required),
            nuovaPassword: new FormControl({value:'', disabled:false}, Validators.required),
            confermaPassword: new FormControl({value:'', disabled:false}, Validators.required)
        });
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

   async onSubmitPassword(){
    const vecchiaPassword = this.passwordForm.get('vecchiaPassword')?.value;
    const nuovaPassword = this.passwordForm.get('nuovaPassword')?.value;
    const confermaPassword = this.passwordForm.get('confermaPassword')?.value;

    if(vecchiaPassword !== this.dati_utente.password){
        this.controlloVecchiaPassword = true;
        this.controlloNuovaPassword = false;
    }else if(nuovaPassword !== confermaPassword){
        this.controlloNuovaPassword = true;
        this.controlloVecchiaPassword = false;
    }else{
        this.controlloVecchiaPassword = false;
        this.controlloNuovaPassword = false;

        try{
            const response = await firstValueFrom(this.utenteService.aggiornaPassword(this.id_utente, nuovaPassword));
            if(response && response.status === 201){
                const alert = await this.alertController.create({
                    header: 'Password aggiornata',
                    message: 'La tua password è stata aggiornata con successo',
                    buttons: ['OK']
                });
                await alert.present();
                this.modalOpen = false;
                this.passwordForm.reset();
            }
        }catch(e:any){
            console.log('Errore durante l\'aggiornamento della password:', e.message);
        }
    }


   }

   chiudiModal(){
    this.modalOpen = false;
    this.controlloVecchiaPassword = false;
    this.controlloNuovaPassword = false;
    this.passwordForm.reset();
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