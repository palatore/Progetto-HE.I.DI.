import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonCard } from '@ionic/angular/standalone';
import { RichiesteUtenteComponent } from './richieste-utente/richieste-utente.component';

@Component({
  selector: 'app-richieste',
  templateUrl: './richieste.page.html',
  styleUrls: ['./richieste.page.scss'],
  standalone: true,
  imports: [RichiesteUtenteComponent, IonCard, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, CommonModule, FormsModule]
})
export class RichiestePage implements OnInit {

  public nuova_richiesta_pending:boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
