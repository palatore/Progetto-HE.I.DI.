//questo service si chiama login ma contiene anche i metodi per registrarsi e per recuperare i dati

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl:String = "http://localhost:3000"; //sostituire con l'url corretto poi

  constructor(private router:Router, private http:HttpClient) { }

  login(email: string, password: string): Observable<any> {
    console.log('Dati inviati al server:', { email, password });
    return this.http.post(`${this.apiUrl}/login`, { email, password }, {observe: 'response'});
  }

  loginD(email: string, password: string): Observable<any> {
    console.log('Dati inviati al server:', { email, password });
    return this.http.post(`${this.apiUrl}/loginD`, { email, password }, {observe: 'response'});
  }

  async onLoginSuccess(type:String) {
    if(type === "D") {
      await this.router.navigate(["/homeDietologo"]);
    }
    else {
      await this.router.navigate(['/home']);
    }
  }

  register(ruolo:string, email:string, nome:string, cognome:string, password:string): Observable<any> {
    console.log('Dati invati al server:', { ruolo, email, nome, cognome, password});
    return this.http.post(`${this.apiUrl}/registration`, {ruolo, email, nome, cognome, password}, {observe: 'response'});
  }

  async onRegistrationSuccess() {
   await this.router.navigate(['/login']);
  }
}
