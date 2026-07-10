import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonRow, IonGrid, IonCol, IonCardTitle, IonCardHeader, IonCard, IonLabel, IonInput, IonButton, IonItem, IonCardContent, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { flame, flashOutline, logInOutline } from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';
import { LoginService } from 'src/app/services/auth/login.service';
import { RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonText, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonIcon, IonGrid, IonRow, IonCol, IonCardTitle, IonCardHeader, IonCardContent, IonCard, IonLabel, IonInput, IonButton, IonItem, RouterModule]
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public loginFailed = false;
  public serverError = false;
  public showError = false;
  public errMessage:string = '';

  constructor(private formBuilder: FormBuilder, private loginservice:LoginService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
    addIcons({flame, flashOutline, logInOutline});
   }

  ngOnInit() {
    const tipoUtente = (localStorage.getItem('tipoUtente'));
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');
    if(tipoUtente && userEmail && token) {
      //Utente già loggato, reindirizzato alla home, per ora tra commenti perché è responsabilità del guard
      //this.loginservice.onLoginSuccess(tipoUtente);
    }
  }

  async onSubmit() {
    if (!this.loginForm.valid) {
      console.log('Il form non è valido');
      return;
    }
    
    this.loginFailed = false;
    this.showError = false;
    try {
      const response =  await firstValueFrom(this.loginservice.login(this.loginForm.value.email, this.loginForm.value.password));
      const token = response.token;
      const decoded:any = jwtDecode(token);
      localStorage.setItem('userEmail', this.loginForm.value.email);
      localStorage.setItem('token', token);
      await this.loginservice.onLoginSuccess(decoded.ruolo);
      }
    catch (e:any) {
      if(e.status === 401) {
        this.loginFailed = true;
        this.showError = true;
        this.errMessage = e?.error?.error || 'Dati di accesso non validi';
      } else {
        this.errMessage = e?.error?.error || 'Errore di accesso';
        this.loginFailed = true;
        this.showError = true;
      }
    }
  }
}
