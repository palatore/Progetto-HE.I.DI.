import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonItem, IonTitle, IonToolbar, IonIcon, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { LoginService } from 'src/app/services/auth/login.service';
import { map, Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CalendarioComponent } from "src/app/components/calendario/calendario.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonButtons, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonCard, IonCardContent, IonMenuButton, ReactiveFormsModule, RouterModule, CalendarioComponent]
})
export class HomePage implements OnInit {

  constructor(private loginService:LoginService) {
    this.ruoloUtente = this.loginService.getUserRole();
  }
 
  ruoloUtente: Observable<string | null>; ;

  ngOnInit() {}

  public sidebar:boolean = false;

  ionViewWillEnter() {
    this.sidebar = false;
  }

  isLoggedIn(): Observable<boolean> {
    return this.ruoloUtente.pipe(map(role => role !== null));
  }

  toggleSidebar() {
    if(this.sidebar) {
      this.sidebar = false;
    } else {
      this.sidebar = true;
    }
  }

  async logout() {
    await this.loginService.onLogoutSuccess();
  }
  
}
