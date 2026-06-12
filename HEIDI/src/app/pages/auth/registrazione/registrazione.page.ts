import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonRow, IonGrid, IonCol, IonCardTitle, IonCardHeader, IonCard, IonLabel, IonInput, IonButton, IonItem, IonCardContent, IonRadio, IonRadioGroup } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LoginService } from 'src/app/services/auth/login.service';

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.page.html',
  styleUrls: ['./registrazione.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonIcon, IonGrid, IonRow, IonCol, IonCardTitle, IonCardHeader, IonCardContent, IonCard, IonLabel, IonInput, IonButton, IonItem, RouterModule, IonRadio, IonRadioGroup],
})

export class RegistrazionePage implements OnInit {

  public registerForm:FormGroup;
  public errMessage: string = '';
  public registrationFailed: boolean = false;
  public serverError: boolean = false;
  public showError: boolean = false;

  constructor(private formbuilder:FormBuilder, private registrationService:LoginService) { 
    this.registerForm = formbuilder.group({
      ruolo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nome: ['', Validators.required],
      cognome:['', Validators.required],
      password:['', [Validators.required, Validators.minLength(8)]],
      repeatpw:['', [Validators.required, Validators.minLength(8)]]
    }, { validators: passwordMatchValidator() });
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.updateValueAndValidity();
    });
    this.registerForm.get('repeatpw')?.valueChanges.subscribe(() => {
      this.registerForm.updateValueAndValidity();
    });
  }

  ngOnInit() {
  }

  async onSubmit() {
    const ruolo = this.registerForm.value.ruolo;
    const mail = this.registerForm.value.email;
    const name = this.registerForm.value.nome;
    const surname = this.registerForm.value.cognome;
    const pw = this.registerForm.value.password;

    try{
      const response = await firstValueFrom(this.registrationService.register(ruolo, name, surname, mail, pw));
      console.log('Registrazione completata con successo:', response);
      if(!response.body.success || response.status !== 201) {
        console.log('Registrazione fallita');
        this.showError = true;
        this.registrationFailed = true;
        this.serverError =  true;
        this.errMessage = 'Errore interno';
      } else {
        console.log('Registrato il profilo con id:', response.body.data.id, response.body.data.ruolo);
        await this.registrationService.onRegistrationSuccess();
      }
    } catch(e:any) {

    } 
  }

}

export function passwordMatchValidator():ValidatorFn {
  return (group:AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const repeatpw = group.get('repeatpw')?.value;
    return password === repeatpw ? null : {passwordMismatch: true};
  };
}
