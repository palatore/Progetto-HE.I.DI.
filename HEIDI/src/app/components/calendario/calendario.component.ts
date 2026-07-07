import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertController, IonButton, IonCard, IonCardContent, IonCardHeader, IonGrid, IonRow, IonCol, IonHeader, IonInput, IonContent, IonLabel, IonItem, IonModal, IonToolbar, IonTitle, IonList, IonListHeader, IonText, IonBadge, IonSearchbar, IonIcon, IonThumbnail, IonCardTitle, IonButtons, IonFabButton, IonFab, IonFooter } from '@ionic/angular/standalone';
import { filter, firstValueFrom, forkJoin, map, Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { GestionePastiService } from 'src/app/services/pasti/gestione-pasti.service';
import { GestioneAllenamentiService } from 'src/app/services/allenamenti/gestione-allenamenti.service';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import { Pasto } from 'src/app/models/pasto.model';
import { Allenamento } from 'src/app/models/allenamento.model';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss'],
  standalone: true,
  imports: [IonFooter, IonFab, IonFabButton, IonButtons, CommonModule, FullCalendarModule, IonCardTitle, IonButton, IonCard, IonCardContent, IonCardHeader, IonGrid, IonRow, IonCol, IonHeader, IonInput, IonContent, IonLabel, IonItem, IonModal, IonToolbar, IonTitle, IonList, IonListHeader, IonText, IonBadge, IonSearchbar, IonIcon, IonThumbnail, IonCardTitle, IonButtons, IonFabButton, IonFab]
})
export class CalendarioComponent implements OnInit {

  constructor(private foodService:GestionePastiService, private workoutService:GestioneAllenamentiService, private alertController:AlertController) {}

  ngOnInit() {
    this.loadAllEvents();
    addIcons({ arrowBack });
  }

  @ViewChild('calendario') calendar_component!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'it', // Lingua italiana
    headerToolbar: {
      left: 'prev', // Crea i bottoni per scorrere
      center: 'title,today',
      right: 'next'
    },
    buttonText:{
      today: 'Torna ad oggi'
    },
    height: 'auto',
    firstDay: 1,

    dateClick: (info) => this.handleDateClick(info.dateStr),

    events: []
  };

  public isShow:boolean = false;
  public aggiuntaAttivita:boolean = false;
  
  public data_selezionata:string = '';
  public attivita_calendario:any[] = [];
  public pasti_giornalieri:Pasto[] = [];
  public allenamenti_giornalieri:Allenamento[] = [];
  public pasti_utente:Pasto[] = [];
  public allenamenti_utente:Allenamento[] = [];

  handleDateClick(dateStr:string) {
    this.data_selezionata = dateStr;
    this.isShow = true;
    this.aggiuntaAttivita = false;
    this.loadAttivitaGiornaliere();
  }

  loadAttivitaGiornaliere() {
    const attivita_giornaliere = this.attivita_calendario.filter(attivita => attivita.start === this.data_selezionata);

    this.pasti_giornalieri = attivita_giornaliere.filter(a => a.extendedProps.tipo === 'pasto').map(a => a.extendedProps.dati);
    this.allenamenti_giornalieri = attivita_giornaliere.filter(a => a.extendedProps.tipo === 'allenamento').map(a => a.extendedProps.dati);
  }

  aggiungiAttivita() {
    forkJoin({
      all_pasti: this.foodService.getPastiUtente(),
      all_allenamenti: this.workoutService.getAllenamentiUtente()
    }).subscribe({
      next: ({all_pasti, all_allenamenti}) => {
        this.pasti_utente = all_pasti;
        this.allenamenti_utente = all_allenamenti;
      },
      error: (err) => {
        console.error('Errore nel caricamento e nell\'unione dei dati:', err);
      }
    });

    this.aggiuntaAttivita = true;

  }

  async fissaPasto(id_attivita:number) {
    try {
      const response = await firstValueFrom(this.foodService.programmaPasto(id_attivita, this.data_selezionata));
      if(response && response.status === 201) {
        this.aggiuntaAttivita = false;
      }
    } catch(e:any) {
      if(e instanceof Error) {
        console.log(e.message);
      }
    }
    this.loadAllEvents();
  }

  async disdiciPasto(id_pasto:number) {
    try {
      const response = await firstValueFrom(this.foodService.disdiciPasto(id_pasto, this.data_selezionata));
    } catch (e:any) {
      if(e instanceof Error) {
        console.log(e.message);
      }
    }
  }

  async fissaAllenamento(id_allenamento:number) {
    //metodo per cambiare la data all'allenamento
    console.log('data_selezionata:', this.data_selezionata);
    const nuova_data = this.data_selezionata;
    console.log('nuova_data:', nuova_data);

    //controlla prima se esiste già un allenamento nella stessa data
    try {
        const response = await firstValueFrom(this.workoutService.checkAllenamento(this.data_selezionata));
        if(response && response.exists){
            const alert = await this.alertController.create({
                    header: 'Attenzione!',
                    message: 'Non puoi inserire più allenamenti nello stesso giorno',
                    buttons: ['OK']
                });
                await alert.present();
            return;
        }
    } catch(e:any){
        if(e instanceof Error){
            console.log(e.message);
            return;
        }
    }
        //se non esiste, crea l'allenamento
    try {
      const allenamentoFissato = await firstValueFrom(this.workoutService.programmaAllenamento(id_allenamento, nuova_data));
      if(allenamentoFissato && allenamentoFissato.status === 201) {
        this.aggiuntaAttivita = false;
        this.loadAllEvents();
      }
    } catch(e) {
      if(e instanceof Error) {
        console.log(e.message);
      }
    }

  }

  async eliminaAllenamento(id_allenamento:number) {
    try {
      const response = await firstValueFrom(this.workoutService.eliminaAllenamento(id_allenamento));
      if(response && response.status === 201) {
        this.isShow = false;
      }
    } catch (e:any) {
      if(e instanceof Error) {
        console.log(e.message);
      }
    }
  }

  chiudiModal() {
    console.log('chiudiModal chiamato');
    this.loadAllEvents();
    this.pasti_giornalieri = [];
    this.allenamenti_giornalieri = [];
    this.pasti_utente = [];
    this.allenamenti_utente = [];
    this.isShow = false;
    this.aggiuntaAttivita = false;
  }

  loadAllEvents() {
    forkJoin({
      pasti: this.foodService.getPastiProgrammati(),
      allenamenti: this.workoutService.getAllenamentiUtente().pipe(
        map(allenamenti_totali => {
          return allenamenti_totali.filter(allenamento => allenamento.data !== null && allenamento.data !== undefined);
        })
      )
    }).subscribe({
      next: ({pasti, allenamenti}) => {

        console.log('Pasti ricevuti dal DB:', pasti.length);
        console.log('Allenamenti ricevuti dal DB:', allenamenti.length);

        const tutte_le_attivita:any[] = []; 

        pasti.forEach(p => {
            tutte_le_attivita.push({
              id: `pasto_${p.id}`,
              title: `🍲`,
              start: p.data_calendario!,
              color: '#3880ff',
              extendedProps: {tipo: 'pasto', dati: p}
            });
          });

        allenamenti.forEach(a => {
          if(!a.data) {
            return;
          }

          const converti_data_allenamento = new Date(a.data);

          const anno = converti_data_allenamento.getFullYear();
          const mese = String(converti_data_allenamento.getMonth() + 1).padStart(2, '0');
          const giorno = String(converti_data_allenamento.getDate()).padStart(2, '0');

          const data_alleamento = `${anno}-${mese}-${giorno}`;

          tutte_le_attivita.push({
            id: `allenamento_${a.id}`,
            title: `🏋️`,
            start: data_alleamento,
            color:'#7B1FA2',
            extendedProps: {tipo: 'allenamento', dati: a}
          });
        });

        this.attivita_calendario = tutte_le_attivita;

        if(this.calendar_component) {
          console.log(this.calendar_component);
          const calendar_api = this.calendar_component.getApi();
          console.log('calendario già esistente')
          calendar_api.removeAllEvents();
          calendar_api.addEventSource(tutte_le_attivita);
          console.log('attivit', this.calendarOptions.events);
        } else {
          this.calendarOptions.events = tutte_le_attivita;
        }
        this.loadAttivitaGiornaliere();
      },
      error: (err) => {
        console.error('Errore nel caricamento e nell\'unione degli eventi:', err);
      }
    });
  }
}
