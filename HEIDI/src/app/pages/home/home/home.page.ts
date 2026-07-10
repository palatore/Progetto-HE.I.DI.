import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonContent, IonCardHeader, IonCardTitle, IonSegment, IonSegmentButton, IonLabel, IonGrid, IonRow, IonCol, IonItem, IonIcon, IonBadge, IonAvatar, IonList } from '@ionic/angular/standalone';
import { forkJoin, map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';
import { LoginService } from 'src/app/services/auth/login.service';
import { GestioneUtentiService } from 'src/app/services/utenti/gestione-utenti.service';
import { GestionePastiService } from 'src/app/services/pasti/gestione-pasti.service';
import { GestioneAllenamentiService } from 'src/app/services/allenamenti/gestione-allenamenti.service';
import { Allenamento } from 'src/app/models/allenamento.model';
import { Pasto } from 'src/app/models/pasto.model';
import { DefaultHeaderComponent } from "src/app/components/default-header/default-header.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonList, IonAvatar, IonBadge, IonIcon, IonItem, IonCol, IonRow, IonGrid, IonLabel, IonSegmentButton, IonSegment, IonContent, CommonModule, FormsModule, IonButton, IonCard, IonCardContent, ReactiveFormsModule, RouterModule, IonCardHeader, IonCardTitle, DefaultHeaderComponent]
})
export class HomePage implements OnInit {

  constructor(private authService:LoginService, private userService:GestioneUtentiService, private foodService:GestionePastiService, private workoutService:GestioneAllenamentiService) {
  this.ruoloUtente = this.authService.ruoloUtente.value;
  }
 
  public ruoloUtente: string | null = null;
  public feedAssociati:any[] = [];
  public associazioni_pending:number = 0;
  public richieste_pending:number = 0;
  private destroy$ = new Subject<void>();

  ngOnInit() {}

  public visualizzazione: 'pasti' | 'allenamenti' = 'pasti';

  pasti_odierni:any = {
    Colazione: null,
    Merenda: null,
    Pranzo: null,
    Spuntino: null,
    Cena: null
  };
  dettagli_pasti_odierni:any = {
    Colazione: null,
    Merenda: null,
    Pranzo: null,
    Spuntino: null,
    Cena: null,
  };
  allenamento_odierno:Allenamento | null = null;


  ionViewWillEnter() {

    this.authService.ruoloUtente.pipe(takeUntil(this.destroy$)).subscribe({
      next: (ruolo) => {
        this.ruoloUtente = ruolo;
      },
      error: (err) => {
        console.error('Errore nel recupero del ruolo utente', err);
      }
    });

    if(this.ruoloUtente === '0') {
      this.caricaAttivitaGiornaliere();
    } else {
      this.getAssociazioniPending();
      this.getRichiestePending();
      this.getFeedAssociati();
    }
 
  }

  caricaAttivitaGiornaliere() {
    const oggi = new Date().toISOString().split('T')[0];
    const oggi_a = new Date();
    oggi_a.setHours(0, 0, 0, 0);

    forkJoin({
      pasti: this.foodService.getPastiProgrammati(),
      allenamenti: this.workoutService.getAllenamentiUtente()
    }).pipe(
      switchMap(({pasti, allenamenti}) => {
        const pasti_filtrati = pasti.filter((p:Pasto) => p.data_calendario === oggi);

        if(pasti_filtrati.length === 0) {
          return of({pasti_con_dettaglio: [], allenamenti});
        }

        const chiamate_dettagli = pasti_filtrati.map((pasto:Pasto) =>
          this.foodService.getDettagliPasto(pasto.id).pipe(
            map(dettagli => ({pasto, dettagli}))
          )
        );

        return forkJoin(chiamate_dettagli).pipe(
          map(pasti_con_dettaglio => ({pasti_con_dettaglio, allenamenti}))
        );
      })
    ).pipe(takeUntil(this.destroy$)).subscribe({
      next: ({pasti_con_dettaglio, allenamenti}) => {
        pasti_con_dettaglio.forEach(({pasto, dettagli}) => {
          const tipologia = pasto.tipo;
          this.pasti_odierni[tipologia] = pasto;
          this.dettagli_pasti_odierni[tipologia] = dettagli.alimenti;
        });

        this.allenamento_odierno = allenamenti.find((allenamento:Allenamento) => {
          const data_cmp = new Date(allenamento.data);
          data_cmp.setHours(0, 0, 0, 0);
          return data_cmp.getTime() === oggi_a.getTime();
        }) || null;
      },
      error: (err) => console.error('Errore nel caricamento delle attività giornalieree', err)
    });
  }

  getAssociazioniPending() {
    this.userService.getAssociazioniPending().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {this.associazioni_pending = data.length;},
      error: (err) => {console.error(err);}
    }); 
  }

  getRichiestePending() {
    this.userService.getRichiestePending().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {this.richieste_pending = data.length;},
      error: (err) => {console.error(err);}
    }); 
  }

  getFeedAssociati() {
    this.userService.getFeedAssociati().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => this.feedAssociati = data,
      error: (err) => console.error(err)
    }); 
  }

  ionViewWillLeave() {
    this.destroy$.next();
  }
}
