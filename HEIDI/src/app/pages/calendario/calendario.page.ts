import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton } from '@ionic/angular/standalone';
import { CalendarioComponent } from 'src/app/components/calendario/calendario.component';

@Component({
  selector: 'app-calendariopage',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonMenuButton, CalendarioComponent]
})
export class CalendarioPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
