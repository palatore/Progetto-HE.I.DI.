import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { DefaultHeaderComponent } from 'src/app/components/default-header/default-header.component';

@Component({
  selector: 'app-gestione-professionisti',
  templateUrl: './gestione-professionisti.page.html',
  styleUrls: ['./gestione-professionisti.page.scss'],
  standalone: true,
  imports: [IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, DefaultHeaderComponent, IonCardContent]
})
export class GestioneProfessionistiPage implements OnInit {

  constructor() { }

  public professionisti:any[] = [];

  ngOnInit() {
    this.loadProfessionisti();
  }

 async loadProfessionisti() {
    try {

    } catch(err) {
      console.log(err);
    }
  }

}
