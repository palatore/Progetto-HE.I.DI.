import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { LoginService } from 'src/app/services/auth/login.service';
import { GestionePastiService } from 'src/app/services/utente/gestione-pasti.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol, ReactiveFormsModule, IonInput, RouterModule]
})
export class HomePage implements OnInit {

  constructor(private loginService:LoginService) {}

  ngOnInit() {
  }

  showForm() {
    console.log('hey');
  }

//controlla il localstorage per impostare un flag su home.page.html che mostra o nasconde determinati elementi in base al tipo di utente loggato
  isLoggedIn() {
    const tipoUtente = localStorage.getItem('tipoUtente');
    return tipoUtente !== null;
  }

  async logout() {
    localStorage.removeItem('tipoUtente');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    await this.loginService.onLogoutSuccess();
  }
}
