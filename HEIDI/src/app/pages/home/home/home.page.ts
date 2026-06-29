import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonCardHeader, IonCardTitle, IonSegment, IonSegmentButton, IonLabel, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { LoginService } from 'src/app/services/auth/login.service';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { RouterModule } from '@angular/router';
import { GestionePastiService } from 'src/app/services/pasti/gestione-pasti.service';
import { GestioneAllenamentiService } from 'src/app/services/allenamenti/gestione-allenamenti.service';
import { Allenamento } from 'src/app/models/allenamento.model';
import { Pasto } from 'src/app/models/pasto.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonGrid, IonLabel, IonSegmentButton, IonSegment, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonCard, IonCardContent, IonMenuButton, ReactiveFormsModule, RouterModule, IonCardHeader, IonCardTitle]
})
export class HomePage implements OnInit {

  constructor(private authService:LoginService, private foodService:GestionePastiService, private workoutService:GestioneAllenamentiService) {
    this.ruoloUtente = this.authService.getUserRole();
  }
 
  ruoloUtente: Observable<string | null>; ;

  ngOnInit() {
    this.caricaAttivitaGiornaliere();
  }

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
    this.caricaAttivitaGiornaliere();
  }

  async caricaAttivitaGiornaliere() {
    const oggi = new Date().toISOString().split('T')[0];
    const oggi_a = new Date();
    oggi_a.setHours(0, 0, 0, 0);

    forkJoin({
      pasti: this.foodService.getPastiProgrammati(),
      allenamenti: this.workoutService.getAllenamentiUtente()
    }).pipe(
      switchMap(({pasti, allenamenti}) => {
        const pasti_filtrati = pasti.filter((p:Pasto) => p.data_calendario === oggi);
        console.log('ho filtrato i pasti:', pasti_filtrati);

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
    ).subscribe({
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

  isLoggedIn(): Observable<boolean> {
    return this.ruoloUtente.pipe(map(role => role !== null));
  }
}
