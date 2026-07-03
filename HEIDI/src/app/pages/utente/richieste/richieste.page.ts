import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonBadge, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RichiesteUtenteComponent } from './richieste-utente/richieste-utente.component';
import { GestioneUtentiService } from 'src/app/services/utenti/gestione-utenti.service';
import { firstValueFrom, map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-richieste',
  templateUrl: './richieste.page.html',
  styleUrls: ['./richieste.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonBadge, IonLabel, IonItem, IonList, IonCardContent, RichiesteUtenteComponent, IonCard, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, CommonModule, FormsModule, IonCardHeader, IonCardTitle]
})
export class RichiestePage implements OnInit, OnDestroy{

  public nuova_richiesta_pending:boolean = false;
  public associazioni:any[] = [];
  public richieste_associazioni:any[] = [];
  public richieste_voto:any[] = [];
  public richieste_modifica:any[] = [];
  private destroy$ = new Subject<void>();

  constructor(private userService:GestioneUtentiService) { }

  ngOnInit() {
    console.log('Caricamento richieste in corso...');
    this.loadAllAssociazioni();
    this.loadAllRichieste();
  }

  ionViewWillEnter() {
    
  }

  //Da finire dopo aver implementato richieste di voto e modifiche lato utente
  async loadAllRichieste() {
   
  }

  async loadAllAssociazioni() {
    this.userService.getAssociazioniProfessionista().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        console.log('Associazioni caricate:', data);
        this.associazioni = data;

        this.richieste_associazioni = this.associazioni.filter(associazione => associazione.stato === 'PENDING');
        console.log('Richieste associazioni filtrate:', this.richieste_associazioni);

        if(this.richieste_associazioni.length > 0 || this.richieste_voto.length > 0 || this.richieste_modifica.length > 0) {
          this.nuova_richiesta_pending = true;
        }
      },
      error: (err) => {console.log('Errore nel caricamento delle associazioni', err)}
    });
  }

  async accettaAssociazione(id_associazione:number) {
    try {
      const response = await firstValueFrom(this.userService.accettaAssociazione(id_associazione));
      if(response && response.status === 201) {
        console.log('Associazione accettata con successo');
        this.loadAllAssociazioni();
      } else {
        console.log('Errore nell\'accettazione dell\'associazione');
      }
    } catch(e) {
      if(e instanceof Error) {
        console.log('Errore nell\'accettazione dell\'associazione', e.message);
      }
    }
  }

  ngOnDestroy() {
    console.log('ondestroy');
    this.destroy$.next();
    this.destroy$.complete();
  }

}
