//questo service si chiama login ma contiene anche i metodi per registrarsi e per recuperare i dati

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl:String = "http://localhost:3000"; //sostituire con l'url corretto poi
  private userRole = new BehaviorSubject<string | null>(null);

  constructor(private router:Router, private http:HttpClient) {
    this.userRole.next(localStorage.getItem('tipoUtente'));
  }

  login(email: string, password: string) {
    console.log('Dati inviati al server:', { email, password });
    return this.http.post<any>(`${this.apiUrl}/api/auth/login`, { email, password });
  }

  async onLoginSuccess(type:string) {
    if(type === "P") {
      await this.router.navigate(["/homeDietologo"]);
    }
    else {
      await this.router.navigate(['/home']);
    }
  }

  getUserRole(): Observable<string | null> {
    return this.userRole.asObservable();
  }

  register(ruolo:string, nome:string, cognome:string, email:string, password:string): Observable<any> {
    console.log('Dati invati al server:', { ruolo, nome, cognome, email, password});
    return this.http.post(`${this.apiUrl}/api/auth/register`, {ruolo, nome, cognome, email, password}, {observe: 'response'});
  }

  async onRegistrationSuccess() {
   await this.router.navigate(['/login']);
  }

  async onLogoutSuccess() {
    this.userRole.next(null);
    await this.router.navigate(['/login']);
  }
}
