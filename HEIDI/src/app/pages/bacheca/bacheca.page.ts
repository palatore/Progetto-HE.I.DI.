import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonToolbar, IonSegment, IonSegmentButton, IonCard, IonItem, IonAvatar, IonLabel, IonBadge, IonCardContent, IonIcon, IonButton, ActionSheetController } from '@ionic/angular/standalone';
import { firstValueFrom, Subject, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { DefaultHeaderComponent } from "src/app/components/default-header/default-header.component";
import { GestioneBachecaService } from 'src/app/services/bacheca/gestione-bacheca.service';
import { GestionePastiService } from 'src/app/services/pasti/gestione-pasti.service';
import { GestioneAllenamentiService } from 'src/app/services/allenamenti/gestione-allenamenti.service';
import { VotaAttivitaComponent } from "src/app/components/vota-attivita/vota-attivita.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-bacheca',
  templateUrl: './bacheca.page.html',
  styleUrls: ['./bacheca.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonCardContent, IonBadge, IonLabel, IonAvatar, IonItem, IonCard, IonSegmentButton, IonSegment, IonContent, IonToolbar, CommonModule, FormsModule, DefaultHeaderComponent, VotaAttivitaComponent]
})
export class BachecaPage implements OnInit {

  public attivita_bacheca: any[] = [];
  public attivita_filtrate: any[] = [];
  public filtro:string = "tutti";

  private destroy$ = new Subject<void>();

  constructor(private boardService:GestioneBachecaService, private foodServive:GestionePastiService, private workoutService:GestioneAllenamentiService, private router:Router, private alertController:AlertController, private actionSheetController:ActionSheetController) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.caricaBacheca();
  }

  ionViewWillLeave() {
    this.destroy$.next();
  }

  caricaBacheca() {
    this.attivita_bacheca = [];
    this.attivita_filtrate = [];

    forkJoin({
      pasti: this.boardService.getPastiBacheca(),
      allenamenti: this.boardService.getAllenamentiBacheca()
      }).pipe(takeUntil(this.destroy$)).subscribe({
        next: ({ pasti, allenamenti }) => {
          const pasti_formattati = pasti.map((p) => ({
            ...p,
            tipologia_mostrata: 'PASTO',
            modalita_dettagli: false,
            modalita_voto: false,
            disable_voto: false,
            disable_clona: false,
            dettagli: [],
            media: 0,
            voti_totali_attivita: 0
          }));

          const allenamenti_formattati = allenamenti.map((a) => ({
            ...a,
            tipologia_mostrata: 'ALLENAMENTO',
            modalita_dettagli: false,
            modalita_voto: false,
            disable_voto: false,
            disable_clona: false,
            dettagli: [],
            media: 0,
            voti_totali_attivita: 0
          }));

          const attivita_bacheca_caricate = [...pasti_formattati, ...allenamenti_formattati];

          this.attivita_bacheca = attivita_bacheca_caricate.sort((a, b) => {
            return new Date(b.data_condivisione).getTime() - new Date(a.data_condivisione).getTime();
          });

          this.filtraBacheca();
          this.caricaVotiIniziali();
        },
        error: (err) => console.log('Errore durante il forkjoin', err)
      }
    );
  }

  async caricaVotiIniziali() {
  for (let attivita of this.attivita_bacheca) {
    await this.getVotoAttivita(attivita);
  }
}

  filtraBacheca() {
    if(this.filtro === "tutti") {
      this.attivita_filtrate = this.attivita_bacheca;
    } else {
      this.attivita_filtrate = this.attivita_bacheca.filter(item => item.tipologia_mostrata === this.filtro);
    }
  }

  cambiaFiltro(event: any) {
    this.filtro = event.detail.value;
    this.filtraBacheca();
  }

  async getDettagliAttivita(attivita:any) {
    if(attivita.modalita_dettagli) {
      attivita.modalita_dettagli = false;
      return;
    }
    
    if(attivita.tipologia_attivita === 0) {
      try {
        const response = await firstValueFrom(this.foodServive.getDettagliPasto(attivita.id_attivita));
        attivita.dettagli = response?.alimenti ?? response ?? [];
      } catch (error) {
        console.log(error)
      }
    } else if(attivita.tipologia_attivita === 1) {
      try {
        const response = await firstValueFrom(this.workoutService.getDettagliAllenamento(attivita.id_attivita));
        attivita.dettagli = response?.esercizi ?? response ?? [];
      } catch (error) {
        console.log(error)
      }
    }
    attivita.modalita_dettagli = true;
  }

  alimentoTrack(index: number, alimento: any):string {
    return `${alimento.name}-${alimento.quantita}-${alimento.kcal}`;
  }
  esercizioTrack(index: number, esercizio: any):string {
    return `${esercizio.name} - ${esercizio.serie} - ${esercizio.ripetizioni} - ${esercizio.pesi_kg} - ${esercizio.riposo_minuti}`;
  }

  async importaAttivita(attivita:any) {
    if(attivita.tipologia_attivita === 0) {
      try {
        const response = await firstValueFrom(this.foodServive.clonaPasto(attivita.id_attivita));
        if(response?.status === 201) {
          const alert = await this.alertController.create({
              header: 'Successo',
              message: 'Pasto clonato con successo!',
              buttons: ['OK']
            });
            await alert.present()

            attivita.disable_clona = true;
        }
      } catch (error) {
        console.log(error);
      }
    } else if(attivita.tipologia_attivita === 1) {
      try {
        const response = await firstValueFrom(this.workoutService.clonaAllenamento(attivita.id_attivita));
        if(response?.status === 201) {
          const alert = await this.alertController.create({
              header: 'Successo',
              message: 'Allenamento clonato con successo!',
              buttons: ['OK']
            });
            await alert.present()

            attivita.disable_clona = true;
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async getVotoAttivita(attivita:any) {
    try {
      const voti = await firstValueFrom(this.boardService.getVotiAttivita(attivita.id_attivita, attivita.tipologia_attivita));
      attivita.voti_totali_attivita = voti.length;

      if(voti && voti.length > 0) {
        let somma = 0;

        for(let i = 0; i < voti.length; i++) {
          somma += Number(voti[i].voto);
        }

        const mediaGrezza = somma/voti.length;
        attivita.media = Math.round(mediaGrezza * 10)/10;
      } else {
        attivita.media = 0;
      }
    } catch(error) {
      console.log(error);
    }
  }

  votaAttivita(attivita:any) {
    if(attivita.modalita_voto) {
      attivita.modalita_voto = false;
      return;
    }
    this.getVotoAttivita(attivita);
    attivita.modalita_voto = true;
  }

  async inviaVoto(voto:number, attivita:any) {
    try {
      const voto_da_inviare = {id: attivita.id_attivita, valutazione:voto, tipologia:attivita.tipologia_attivita};
      const response = await firstValueFrom(this.boardService.votaAttivita(voto_da_inviare));
      if(response.status === 201) {
        const alert = await this.alertController.create({
            header: 'Successo',
            message: 'Attività votata con successo!',
            buttons: ['OK']
          });
          await alert.present()
      }
      attivita.modalita_voto = false;
      attivita.disable_voto = true;
    } catch(error) {
      console.log(error);
    }
  }

  async condivisione() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Cosa vuoi condividere oggi?',
      buttons: [
        {
          text: 'Un mio Pasto',
          icon: 'fast-food-outline',
          cssClass: 'iconaCondividi',
          handler: () => {
            this.router.navigate(['/pastiUtente']);
          }
        },
        {
          text: 'Un mio Allenamento',
          icon: 'barbell-outline',
          cssClass: 'iconaCondividi',
          handler: () => {
            this.router.navigate(['/allenamentiUtente']);
          }
        },
        {
          text: 'Annulla',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

}
