import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonRow, IonGrid, IonCol, IonCardTitle, IonCardHeader, IonCard, IonLabel, IonInput, IonButton, IonItem, IonCardContent, IonSegment, IonSegmentButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { firstValueFrom } from 'rxjs';
import { LoginService } from 'src/app/services/auth/login.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonIcon, IonGrid, IonRow, IonCol, IonCardTitle, IonCardHeader, IonCardContent, IonCard, IonLabel, IonInput, IonButton, IonItem, IonSegment, IonSegmentButton, RouterModule]
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public loginType: string = 'Utente';
  public loginFailed = false;
  public serverError = false;
  public showError = false;
  public errMessage:string = '';

  constructor(private formBuilder: FormBuilder, private loginservice:LoginService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
    addIcons({
      'a': 'assets/icon/mountain_line_art.svg',
    });
   }

  ngOnInit() {
    const tipoUtente = localStorage.getItem('tipoUtente');
    const userEmail = localStorage.getItem('userEmail');
    if(tipoUtente && userEmail) {
      //Utente già loggato, reindirizzato alla home
    }
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form inviato!', this.loginForm.value);
      // Qui avviene il login
      if(this.loginType === "Dietologo") {
        try {
          const response =  await firstValueFrom(this.loginservice.loginD(this.loginForm.value.email, this.loginForm.value.password));
          if(response === null) {
            this.showError = true;
            this.loginFailed = true;
            this.serverError =  true;
            this.errMessage = 'Errore interno';
          }
          else if(response.status === 201) {
            console.log('Login attempt with email:', this.loginForm.value.email);
            console.log('Login attempt with password:', this.loginForm.value.password);
            localStorage.setItem('tipoUtente', this.loginType);
            localStorage.setItem('userEmail', this.loginForm.value.email);
            localStorage.setItem('token', response.token);
            await this.loginservice.onLoginSuccess('D');
            this.loginFailed = false;
          }
        } catch (e:any) {
          if(e.status === 401) {
            this.loginFailed = true;
            this.showError = true;
            this.errMessage = e.status.json;
          }
          else if(e instanceof Error) {
            this.errMessage = e.message || 'Si è verificato un errore.';
            this.loginFailed = true;
            this.showError = true;
          }
        }
      }
      else if(this.loginType === "Utente"){
        try {
          const response =  await firstValueFrom(this.loginservice.login(this.loginForm.value.email, this.loginForm.value.password));
          if(response === null) {
            this.showError = true;
            this.loginFailed = true;
            this.serverError =  true;
            this.errMessage = 'Errore interno';
          }
          else if(response.status === 201) {
            console.log('Login attempt with email:', this.loginForm.value.email);
            console.log('Login attempt with password:', this.loginForm.value.password);
            localStorage.setItem('tipoUtente', this.loginType);
            localStorage.setItem('userEmail', this.loginForm.value.email);
            localStorage.setItem('token', response.token);
            await this.loginservice.onLoginSuccess('U');
            this.loginFailed = false;
          }
        } catch (e:any) {
          if(e.status === 401) {
            this.loginFailed = true;
            this.showError = true;
            this.errMessage = e.status.json;
          }
          else if(e instanceof Error) {
            this.errMessage = e.message || 'Si è verificato un errore.';
            this.loginFailed = true;
            this.showError = true;
          }
        }
      }
    } else {
      console.log('Il form non è valido');
    }
  }

  logout() {
    localStorage.removeItem('tipoUtente');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
  }

}
