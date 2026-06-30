import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonButtons, IonMenuButton, AlertController } from '@ionic/angular/standalone';
import { DefaultHeaderComponent } from 'src/app/components/default-header/default-header.component';
import { GestioneUtentiService } from 'src/app/services/utenti/gestione-utenti.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-gestione-professionisti',
  templateUrl: './gestione-professionisti.page.html',
  styleUrls: ['./gestione-professionisti.page.scss'],
  standalone: true,
  imports: [IonButton, IonButtons, IonMenuButton,IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, DefaultHeaderComponent, IonCardContent]
})
export class GestioneProfessionistiPage implements OnInit {

  constructor(private userService:GestioneUtentiService, private alertController:AlertController) { }

  public professionisti:any[] = [];
  public associazioni:any[] = [];

  ngOnInit() {
    this.loadProfessionisti();
    this.loadAssociazioni();
  }

 async loadProfessionisti() {
    try {
      this.userService.getUtentiByRuolo(3).subscribe({
      next: (data) => {this.professionisti = data;},
      error: (err) => {console.error(err)}
    });
    } catch(err) {
      console.log(err);
    }
  }

  async loadAssociazioni() {
    try {
      this.userService.getAssociazioniUtente().subscribe({
        next: (data) => {this.associazioni = data;},
        error: (err) => {console.log(err);}
      })      
    } catch (e:any) {
      
    }
  }

  //DA IMPLEMENTARE: RUOLI SPECIFICI DA ALBO

  checkRichieste(id_professionista:number):boolean {
    if(this.associazioni.length > 0) {
      for(let associazione of this.associazioni) {
        if(associazione.id_professionista === id_professionista) {
          return true;
        }
      }
    }
    return false;
  }

  async inviaRichiesta(id_professionista:number) {
    //prima controlla che non ci siano richieste già in pending o accettate per questo professionista
    if(this.checkRichieste(id_professionista)) {
      console.error('Associazione già esistente');
      return;
    }
    try {
      const response = await firstValueFrom(this.userService.nuovaAssociazione(id_professionista));
      if(response && response.status === 201) {
        const alert = await this.alertController.create({
          header: 'Richiesta inviata',
          message: 'Hai inviato una richiesta di associazione.',
          buttons: ['OK']
        });
        await alert.present();
      }
    } catch(e:any) {
      if(e instanceof Error) {
        console.log(e.message);
      }
    }

  }

}
