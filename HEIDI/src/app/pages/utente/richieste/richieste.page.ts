import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonBadge, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RichiesteUtenteComponent } from './richieste-utente/richieste-utente.component';
import { GestioneUtentiService } from 'src/app/services/utenti/gestione-utenti.service';
import { map, Subject, takeUntil } from 'rxjs';

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
    this.loadAllAssociazioni();
  }

  ionViewWillEnter() {
    if(this.richieste_associazioni.length > 0 || this.richieste_voto.length > 0 || this.richieste_modifica.length > 0) {
      this.nuova_richiesta_pending = true;
    }
  }

  async loadAllRichieste() {
   
  }

  async loadAllAssociazioni() {
    this.userService.getAssociazioniProfessionista().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.associazioni = data;

        this.richieste_associazioni = this.associazioni.filter(associazione => associazione.stato === 'PENDING');
      },
      error: (err) => {console.log('Errore nel caricamento delle associazioni', err)}
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
