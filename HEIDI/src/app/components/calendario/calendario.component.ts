import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonGrid, IonRow, IonCol, IonHeader, IonInput, IonContent, IonLabel, IonItem, IonModal, IonToolbar, IonTitle, IonList, IonListHeader, IonText, IonBadge, IonSearchbar, IonIcon, IonThumbnail, IonCardTitle, IonButtons } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { LoginService } from 'src/app/services/auth/login.service';
import { GestionePastiService } from 'src/app/services/pasti/gestione-pasti.service';
import { GestioneAllenamentiService } from 'src/app/services/allenamenti/gestione-allenamenti.service';
import { CalendarioService } from 'src/app/services/calendario/calendario.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss'],
  standalone: true,
  imports: [IonButtons, CommonModule, FullCalendarModule, IonCardTitle, IonButton, IonCard, IonCardContent, IonCardHeader, IonGrid, IonRow, IonCol, IonHeader, IonInput, IonContent, IonLabel, IonItem, IonModal, IonToolbar, IonTitle, IonList, IonListHeader, IonText, IonBadge, IonSearchbar, IonIcon, IonThumbnail, IonCardTitle]
})
export class CalendarioComponent implements OnInit {

  constructor(private foodService:GestionePastiService, private workoutService:GestioneAllenamentiService) {}

  ngOnInit() {
    
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
  
  public data_selezionata:string = '';

  handleDateClick(dateStr:string) {
    this.data_selezionata = dateStr;
    this.isShow = true;
  }
}
