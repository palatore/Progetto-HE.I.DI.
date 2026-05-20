import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonRow, IonGrid, IonCol, IonCardTitle, IonCardHeader, IonCard, IonLabel, IonInput, IonButton, IonItem, IonCardContent, IonSegment, IonSegmentButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { firstValueFrom } from 'rxjs';
import { LoginService } from 'src/app/services/auth/login.service';
import { RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonIcon, IonGrid, IonRow, IonCol, IonCardTitle, IonCardHeader, IonCardContent, IonCard, IonLabel, IonInput, IonButton, IonItem, IonSegment, IonSegmentButton, RouterModule]
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
    /* addIcons({
      'a': 'assets/icon/mountain_line_art.svg',
    }); */
   }

  ngOnInit() {
    const tipoUtente = Number(localStorage.getItem('tipoUtente'));
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');
    if(tipoUtente && userEmail && token) {
      //Utente già loggato, reindirizzato alla home
      this.loginservice.onLoginSuccess(tipoUtente === 0 ? 'U' : 'P');
    }
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form inviato!', this.loginForm.value);
      // Qui avviene il login
        try {
          const response =  await firstValueFrom(this.loginservice.login(this.loginForm.value.email, this.loginForm.value.password));
          const token = response.token;
          const decoded:any = jwtDecode(token);
          localStorage.setItem('tipoUtente', decoded.ruolo);
          localStorage.setItem('userEmail', this.loginForm.value.email);
          localStorage.setItem('token', token);
          //controlla il ruolo e indirizza alla home corretta, 0 per utente, tutto il resto per Professionisti
          await this.loginservice.onLoginSuccess(decoded.ruolo === 0 ? 'U' : 'P');
          this.loginFailed = false;
          }
        catch (e:any) {
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
