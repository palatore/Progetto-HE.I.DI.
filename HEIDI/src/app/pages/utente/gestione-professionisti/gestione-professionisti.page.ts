import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { DefaultHeaderComponent } from 'src/app/components/default-header/default-header.component';
import { GestioneUtentiService } from 'src/app/services/utenti/gestione-utenti.service';

@Component({
  selector: 'app-gestione-professionisti',
  templateUrl: './gestione-professionisti.page.html',
  styleUrls: ['./gestione-professionisti.page.scss'],
  standalone: true,
  imports: [IonButton, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, DefaultHeaderComponent, IonCardContent]
})
export class GestioneProfessionistiPage implements OnInit {

  constructor(private userService:GestioneUtentiService) { }

  public professionisti:any[] = [];

  ngOnInit() {
    this.loadProfessionisti();
  }

 async loadProfessionisti() {
    try {
      this.userService.getUtentiByRuolo(3).subscribe({
      next: (data) => {this.professionisti = data;},
      error: (err) => {console.error(err)}
    });
    } catch(err) {
      console.log(err);
    }
  }

}
