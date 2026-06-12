import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { DefaultHeaderComponent } from 'src/app/components/default-header/default-header.component';

@Component({
  selector: 'app-gestione-professionisti',
  templateUrl: './gestione-professionisti.page.html',
  styleUrls: ['./gestione-professionisti.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, DefaultHeaderComponent]
})
export class GestioneProfessionistiPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
