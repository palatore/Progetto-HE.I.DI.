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
  private ruoloUtente = new BehaviorSubject<string | null>(null);

  constructor(private router:Router, private http:HttpClient) {
    this.inizializzaRuoloUtente();
  }

  //preleva il ruolo dell'utente dal localStorage e lo imposta nella variabile BehaviorSubject
  //in questo modo chiunque ascolti questa variabile sa se l'utente è loggato o no e se sì che ruolo ricopre
  private inizializzaRuoloUtente() {
    const ruolo = localStorage.getItem('tipoUtente');
    this.ruoloUtente.next(ruolo);
  }

  login(email: string, password: string) {
    console.log('Dati inviati al server:', { email, password });
    return this.http.post<any>(`${this.apiUrl}/api/auth/login`, { email, password });
  }

  async onLoginSuccess(ruolo:string | number) {
    const ruoloStr = ruolo.toString();
    localStorage.setItem('tipoUtente', ruoloStr);
    this.ruoloUtente.next(ruoloStr);
    if(ruolo === '3') { //numero non esistente, da cambiare una volta sistemata la home
      await this.router.navigate(["/home2"]);
    }
    else {
      await this.router.navigate(['/home']);
    }
  }

  getUserRole(): Observable<string | null> {
    return this.ruoloUtente.asObservable();
  }

  register(ruolo:string, nome:string, cognome:string, email:string, password:string): Observable<any> {
    console.log('Dati invati al server:', { ruolo, nome, cognome, email, password});
    return this.http.post(`${this.apiUrl}/api/auth/register`, {ruolo, nome, cognome, email, password}, {observe: 'response'});
  }

  async onRegistrationSuccess() {
   await this.router.navigate(['/login']);
  }

  async onLogoutSuccess() {
    localStorage.removeItem('tipoUtente');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    this.ruoloUtente.next(null);
    await this.router.navigate(['/login']);
  }
}
