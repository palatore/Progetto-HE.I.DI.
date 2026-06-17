import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonGrid, IonRow, IonCol, IonHeader, IonInput, IonContent, IonLabel, IonItem, IonModal, IonToolbar, IonTitle, IonList, IonListHeader, IonText, IonBadge, IonSearchbar, IonIcon, IonThumbnail, IonCardTitle, IonButtons, IonFabButton, IonFab, IonFooter } from '@ionic/angular/standalone';
import { filter, firstValueFrom, map, Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { GestionePastiService } from 'src/app/services/pasti/gestione-pasti.service';
import { GestioneAllenamentiService } from 'src/app/services/allenamenti/gestione-allenamenti.service';
import { CalendarioService } from 'src/app/services/calendario/calendario.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import { Pasto } from 'src/app/models/pasto.model';
@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss'],
  standalone: true,
  imports: [IonFooter, IonFab, IonFabButton, IonButtons, CommonModule, FullCalendarModule, IonCardTitle, IonButton, IonCard, IonCardContent, IonCardHeader, IonGrid, IonRow, IonCol, IonHeader, IonInput, IonContent, IonLabel, IonItem, IonModal, IonToolbar, IonTitle, IonList, IonListHeader, IonText, IonBadge, IonSearchbar, IonIcon, IonThumbnail, IonCardTitle, IonButtons, IonFabButton, IonFab]
})
export class CalendarioComponent implements OnInit {

  constructor(private foodService:GestionePastiService, private workoutService:GestioneAllenamentiService) {}

  ngOnInit() {

    //per ora sto provando a fare solo con i pasti per vedere se funziona. In seguito caricherò tutto
    this.foodService.getPastiProgrammati().subscribe({
      next: (pasti_pianificati) => {
        const eventi_calendario = pasti_pianificati.map(item => {
          return {
            id: `${item.id}`,
            title: `${item.tipo}: ${item.name}`,
            start: item.data_calendario!,
            color: '#ffc409'
          };
        });

        this.calendarOptions.events = eventi_calendario;
      },
      error: (err) => {
        console.error('Errore nel caricamento dei pasti programmati:', err);
      }
    });
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'it', // Lingua italiana
    headerToolbar: {
      left: 'prev,next today', // Crea i bottoni per scorrere
      center: 'title',
      right: ''
    },
    height: 'auto',

    dateClick: (info) => this.handleDateClick(info.dateStr),

    events: []
  };

  public isShow:boolean = false;
  public aggiuntaAttivita:boolean = false;
  
  public data_selezionata:string = '';
  attivita_giornaliere:any[] = [];
  pasti_utente:Pasto[] = [];

  handleDateClick(dateStr:string) {
    this.data_selezionata = dateStr;
    this.isShow = true;
    this.aggiuntaAttivita = false;
    this.loadPastiGiornalieri();
  }

  loadPastiGiornalieri() {
    this.foodService.getPastiProgrammati().subscribe(pasti => {
      if(pasti && pasti.length > 0) {
        this.attivita_giornaliere.push(pasti.filter(p => p.data_calendario === this.data_selezionata));
      }
    });
  }

  aggiungiAttivita() {
    this.foodService.getPastiUtente().subscribe({
      next: (data) => {this.pasti_utente = data;},
      error: (err) => {console.error(err);}
    })

    this.aggiuntaAttivita = true;

  }

  async fissaAttivita(id_attivita:number) {
    try {
      const response = await firstValueFrom(this.foodService.programmaPasto(id_attivita, this.data_selezionata));
      if(response && response.status === 201) {
        this.aggiuntaAttivita = false;
        this.loadPastiGiornalieri();
      }
    } catch(e:any) {
      if(e instanceof Error) {
        console.log(e.message);
      }
    }

  }

  chiudiModal() {
    this.attivita_giornaliere = [];
    this.pasti_utente = [];
    this.isShow = false;
    this.aggiuntaAttivita = false;
  }
}
