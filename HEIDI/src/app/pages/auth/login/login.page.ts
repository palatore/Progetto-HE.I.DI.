import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonRow, IonGrid, IonCol, IonCardTitle, IonCardHeader, IonCard, IonLabel, IonInput, IonButton, IonItem, IonCardContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonIcon, IonGrid, IonRow, IonCol, IonCardTitle, IonCardHeader, IonCardContent, IonCard, IonLabel, IonInput, IonButton, IonItem]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
    addIcons({
      'a': 'assets/icon/mountain_line_art.svg',
    });
   }

  ngOnInit() {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form inviato!', this.loginForm.value);
      // Perform login action here
    } else {
      console.log('Il form non è valido');
    }
  }

}
