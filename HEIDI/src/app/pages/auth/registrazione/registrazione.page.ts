import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonRow, IonGrid, IonCol, IonCardTitle, IonCardHeader, IonCard, IonLabel, IonInput, IonButton, IonItem, IonCardContent, IonRadio, IonRadioGroup, IonSelectOption, IonSelect } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LoginService } from 'src/app/services/auth/login.service';
import { addIcons } from 'ionicons';
import { enterOutline } from 'ionicons/icons';

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.page.html',
  styleUrls: ['./registrazione.page.scss'],
  standalone: true,
  imports: [IonSelect, IonSelectOption, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonIcon, IonGrid, IonRow, IonCol, IonCardTitle, IonCardHeader, IonCardContent, IonCard, IonLabel, IonInput, IonButton, IonItem, RouterModule, IonRadio, IonRadioGroup],
})

export class RegistrazionePage implements OnInit {

  public registerForm:FormGroup;
  public errMessage: string = '';
  public registrationFailed: boolean = false;
  public serverError: boolean = false;
  public showError: boolean = false;

  public ruoliProfessionista:any[] = [];

  constructor(private formbuilder:FormBuilder, private registrationService:LoginService) { 
    this.registerForm = formbuilder.group({
      ruolo: ['', Validators.required],
      id_ruolo_professionista: [''],
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
    this.registerForm.get('ruolo')?.valueChanges.subscribe((ruolo) => {
    if (ruolo === '1' || ruolo === '2') {
      this.loadRuoliProfessionista();
    } else {
      this.ruoliProfessionista = [];
      this.registerForm.get('id_ruolo_professionista')?.reset();
    }
  });
    addIcons({enterOutline});
  }

  ngOnInit() {}

  async loadRuoliProfessionista() {
  try {
    this.ruoliProfessionista = await firstValueFrom(this.registrationService.getRuoliProfessionista());
  } catch (err) {
    console.error(err);
    this.ruoliProfessionista = [];
  }
}

  async onSubmit() {
    const ruolo = this.registerForm.value.ruolo;
    const id_ruolo_professionista = this.registerForm.value.id_ruolo_professionista || null;
    const mail = this.registerForm.value.email;
    const name = this.registerForm.value.nome;
    const surname = this.registerForm.value.cognome;
    const pw = this.registerForm.value.password;
    this.registrationFailed = false;
    this.showError = false;
    this.serverError = false;

    try{
      const response = await firstValueFrom(this.registrationService.register(ruolo, id_ruolo_professionista, name, surname, mail, pw));
      if(!response?.body?.success || response.status !== 201) {
        this.showError = true;
        this.registrationFailed = true;
        this.serverError =  true;
        this.errMessage = 'Errore interno durante la registrazione.';
      } else {
        await this.registrationService.onRegistrationSuccess();
      }
    } catch(e:any) {
      this.registrationFailed = true;
      this.showError = true;
      this.serverError = true;
      this.errMessage = e?.error?.message || 'Registrazione fallita. Riprova più tardi.';
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
