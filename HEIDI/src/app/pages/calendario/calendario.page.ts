import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, IonButton, IonButtons } from '@ionic/angular/standalone';
import { CalendarioComponent } from 'src/app/components/calendario/calendario.component';
import { DefaultHeaderComponent } from 'src/app/components/default-header/default-header.component';

@Component({
  selector: 'app-calendariopage',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
  standalone: true,
  imports: [IonButtons, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonMenuButton, CalendarioComponent, DefaultHeaderComponent]
})
export class CalendarioPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @ViewChild(CalendarioComponent) aggiornaCalendario!: CalendarioComponent;

  ionViewWillEnter(){
    this.aggiornaCalendario.loadAllEvents();
  }

}
