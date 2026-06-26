import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonItem, IonTitle, IonToolbar, IonIcon, IonButtons, IonMenuButton, IonCardHeader, IonCardTitle, IonSegment, IonSegmentButton, IonLabel, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { LoginService } from 'src/app/services/auth/login.service';
import { forkJoin, map, Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CalendarioComponent } from "src/app/components/calendario/calendario.component";
import { GestionePastiService } from 'src/app/services/pasti/gestione-pasti.service';
import { GestioneAllenamentiService } from 'src/app/services/allenamenti/gestione-allenamenti.service';
import { Allenamento } from 'src/app/models/allenamento.model';
import { Pasto } from 'src/app/models/pasto.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonGrid, IonLabel, IonSegmentButton, IonSegment, IonButtons, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonCard, IonCardContent, IonMenuButton, ReactiveFormsModule, RouterModule, CalendarioComponent, IonCardHeader, IonCardTitle]
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
  allenamento_odierno:Allenamento | null = null;


  ionViewWillEnter() {
    this.caricaAttivitaGiornaliere();
  }

  async caricaAttivitaGiornaliere() {
    const oggi = new Date().toISOString().split('T')[0];
    const oggi_a = new Date();

    forkJoin({
      pasti: this.foodService.getPastiProgrammati(),
      allenamenti: this.workoutService.getAllenamentiUtente()
    }).subscribe({
      next: ({pasti, allenamenti}) => {
        const pasti_filtrati = pasti.filter((p:Pasto) => p.data_calendario === oggi);
        console.log('ho filtrato i pasti:', pasti_filtrati);
        pasti_filtrati.forEach((pasto:Pasto) => {
            console.log('funziona e ho assegnato');
            const tipologia = pasto.tipo;
            this.pasti_odierni[tipologia] = pasto;
            console.log(this.pasti_odierni);
        });

        this.allenamento_odierno = allenamenti.find((allenamento:Allenamento) => allenamento.data === oggi_a) || null;
      },
      error: (err) => console.error('Errore nel caricamento delle attività giornalieree', err)
    });

  }

  isLoggedIn(): Observable<boolean> {
    return this.ruoloUtente.pipe(map(role => role !== null));
  }
}
