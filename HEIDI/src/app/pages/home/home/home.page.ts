import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonGrid, IonHeader, IonItem, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { LoginService } from 'src/app/services/auth/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow]
})
export class HomePage implements OnInit {

  constructor(private loginService:LoginService) { }

  ngOnInit() {
  }

  async logout() {
    localStorage.removeItem('tipoUtente');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    await this.loginService.onLogoutSuccess();
  }

}
