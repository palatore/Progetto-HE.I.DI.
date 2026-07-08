import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonBadge, IonButton, IonIcon, AlertController } from '@ionic/angular/standalone';
import { RichiesteUtenteComponent } from './richieste-utente/richieste-utente.component';
import { GestioneUtentiService } from 'src/app/services/utenti/gestione-utenti.service';
import { firstValueFrom, forkJoin, map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { UtentiAssociatiComponent } from 'src/app/components/utenti-associati/utenti-associati.component';
import { DefaultHeaderComponent } from "src/app/components/default-header/default-header.component";
import { LoginService } from 'src/app/services/auth/login.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-richieste',
  templateUrl: './richieste.page.html',
  styleUrls: ['./richieste.page.scss'],
  standalone: true,
  imports: [RouterModule, IonIcon, IonButton, IonBadge, IonLabel, IonItem, IonList, IonCardContent, RichiesteUtenteComponent, IonCard, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, CommonModule, FormsModule, IonCardHeader, IonCardTitle, UtentiAssociatiComponent, DefaultHeaderComponent]
})
export class RichiestePage implements OnInit {

  //VARIABILI ESCLUSIVE LATO UTENTE
  public professionisti:any[] = [];

  //VARIABILI ESCLUSIVE LATO PROFESSIONISTA
  public nuova_richiesta_pending:boolean = false;
  public richieste_associazioni:any[] = [];
  public richieste_voto:any[] = [];
  public richieste_modifica:any[] = [];
  private destroy$ = new Subject<void>();

  //VARIABILI CONDIVISE
  public ruoloUtente:string | null = null;
  public associazioni:any[] = [];
  public associazioni_in_corso:any[] = [];
  public richieste:any[] = [];

  constructor(private userService:GestioneUtentiService, private authService:LoginService, private router:Router, private alertController:AlertController) { }


  //LIFECYCLE PAGINA---------------------------------------------------------------------------
  ngOnInit() {}

  ionViewWillEnter() {
    this.authService.ruoloUtente.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.ruoloUtente = data;

        if(this.ruoloUtente === '0') {
          this.loadProfessionisti();
          this.loadAssociazioniUtente();
          this.loadRichiesteUtente();
        } else {
          this.loadAssociazioniProfessionista();
          this.loadRichiesteProfessionista();
        }
      },
      error: (err) => {console.log('Errore nel caricamento del ruolo', err)}
    });
  }

  ionViewWillLeave() {
    this.destroy$.next();
  }

  //METODI LATO UTENTE---------------------------------------------------------------------------

  //da implementare il caricamento dei ruoli esatti in modo simile al loadAssociazioni
  async loadProfessionisti() {
    try {
      this.userService.getUtentiByRuolo(3).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {this.professionisti = data;},
      error: (err) => {console.error(err)}
    });
    } catch(error) {
      console.log('Errore nell\'accettazione della richiesta', error);
    }
  }

  async loadAssociazioniUtente() {
    try {
      this.userService.getAssociazioniUtente().pipe(switchMap((assoc) => {
        if(assoc.length === 0) {
          return of([]);
        }
        const chiamateRuoli$ = assoc.map((a) => {
          return this.userService.getRuoloProfessionista(a.id_professionista).pipe(
            map((info_ruolo) => {
              return {...a, ruolo: info_ruolo.ruolo};
            })
          );
        });

        return forkJoin(chiamateRuoli$);
      })
    ).subscribe({
      next: (risultato) => {
        this.associazioni = risultato;
        this.associazioni_in_corso = this.associazioni.filter(associazione => associazione.stato === 'ACCETTATA');
      },
      error: (err) => {console.error(err);}
    });
    } catch(error) {
      console.log('Errore nell\'accettazione della richiesta', error);
    }
  }

  loadRichiesteUtente() {
    this.userService.getRichiesteUtente().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => this.richieste = data,
      error: (err) => console.log(err)
    });
  }

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
      const response = await firstValueFrom(this.userService.creaAssociazione(id_professionista));
      if(response && response.status === 201) {
        const alert = await this.alertController.create({
          header: 'Richiesta inviata',
          message: 'Hai inviato una richiesta di associazione.',
          buttons: ['OK']
        });
        await alert.present();
        this.loadAssociazioniUtente();
      }
    } catch(error) {
      console.log('Errore nell\'accettazione della richiesta', error);
    }
  }

  async annullaAssociazione(id_associazione:number) {
    try {
      const response = await firstValueFrom(this.userService.annullaAssociazione(id_associazione));
      if(response && response.status === 201) {
        this.loadAssociazioniUtente();
      } else {
        console.log('Errore annullamento dell\'associazione');
      }
    } catch(error) {
      console.log('Errore nell\'accettazione della richiesta', error);
    }
  }

  //METODI LATO PROFESSIONISTA-------------------------------------------------------------------

  loadRichiesteProfessionista() {
   this.userService.getRichiesteProfessionista().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => this.richieste = data,
      error: (err) => console.log(err)
    });
  }

  loadAssociazioniProfessionista() {
    this.userService.getAssociazioniProfessionista().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.associazioni = data;

        this.richieste_associazioni = this.associazioni.filter(associazione => associazione.stato === 'PENDING');
        this.associazioni_in_corso = this.associazioni.filter(associazione => associazione.stato === 'ACCETTATA');

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
        this.loadAssociazioniProfessionista();
      } else {
        console.log('Errore nell\'accettazione dell\'associazione');
      }
    } catch(error) {
      console.log('Errore nell\'accettazione della richiesta', error);
    }
  }

  async rifiutaAssociazione(id_associazione:number) {
    try {
      const response = await firstValueFrom(this.userService.annullaAssociazione(id_associazione));
      if(response && response.status === 201) {
        this.loadAssociazioniProfessionista();
      }
    } catch(error) {
      console.log('Errore nell\'accettazione della richiesta', error);
    }
  }

  async accettaRichiesta(richiesta: {id:number, id_att:number, tipologia:number, tipo:string}) {

    if(richiesta.tipo !== 'MODIFICA' && richiesta.tipo !== 'VOTO') {
      console.log('Tipo richiesta non valido per l\'accettazione.');
      return;
    } 
    try {
      const response = await firstValueFrom(this.userService.accettaRichiesta(richiesta));
      if(response && response.status === 201) {
        console.log('Accettata con successo');
        if(richiesta.tipologia === 0) {
          await this.router.navigate(['/pastiUtente'], {
            queryParams: {
              pasto_id: richiesta.id_att,
              tipo_richiesta: richiesta.tipo
            }
          });
        } else if(richiesta.tipologia === 1) {
          await this.router.navigate(['/allenamentiUtente'], {
            queryParams: {
              allenamento_id: richiesta.id_att,
              tipo_richiesta: richiesta.tipo
            }
          });
        }
      }
    } catch(error) {
      console.log('Errore nell\'accettazione della richiesta', error);
    }
  }

  async rifiutaRichiesta(id_richiesta:number) {
    try {
      const response = await firstValueFrom(this.userService.annullaRichiesta(id_richiesta));
      if(response && response.status === 201) {
        this.loadRichiesteProfessionista();
      }
    } catch(error) {
      console.log('Errore nell\'accettazione della richiesta', error);
    }
  }
}
