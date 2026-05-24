import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { LoginService } from 'src/app/services/auth/login.service';
import { GestionePastiService } from 'src/app/services/pasti/gestione-pasti.service';
import { map, Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol, ReactiveFormsModule, IonInput, RouterModule]
})
export class HomePage implements OnInit {

  constructor(private loginService:LoginService) {
    this.ruoloUtente = this.loginService.getUserRole();
  }
 
  ruoloUtente: Observable<string | null>; ;

  ngOnInit() {}

  isLoggedIn(): Observable<boolean> {
    return this.ruoloUtente.pipe(map(role => role !== null));
  }

  showForm() {
    console.log('hey');
  }

  async logout() {
    await this.loginService.onLogoutSuccess();
  }
  
}
