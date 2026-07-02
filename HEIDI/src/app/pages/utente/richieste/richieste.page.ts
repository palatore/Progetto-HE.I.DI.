import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonCard } from '@ionic/angular/standalone';
import { RichiesteUtenteComponent } from './richieste-utente/richieste-utente.component';
import { GestioneUtentiService } from 'src/app/services/utenti/gestione-utenti.service';

@Component({
  selector: 'app-richieste',
  templateUrl: './richieste.page.html',
  styleUrls: ['./richieste.page.scss'],
  standalone: true,
  imports: [RichiesteUtenteComponent, IonCard, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, CommonModule, FormsModule]
})
export class RichiestePage implements OnInit {

  public nuova_richiesta_pending:boolean = false;
  public richieste_associazioni:any[] = [];
  public richieste_voto:any[] = [];
  public richieste_modifica:any[] = [];

  constructor(private userService:GestioneUtentiService) { }

  ngOnInit() {
  }

  async loadAllRichieste() {
   
  }

}
