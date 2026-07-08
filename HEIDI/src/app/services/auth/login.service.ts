//questo service si chiama login ma contiene anche i metodi per registrarsi e per recuperare i dati

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl:String = "http://localhost:3000";
  public ruoloUtente = new BehaviorSubject<string | null>(null);

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
    return this.http.post<any>(`${this.apiUrl}/api/auth/login`, { email, password });
  }

  async onLoginSuccess(ruolo:string | number) {
    const ruoloStr = ruolo.toString();
    localStorage.setItem('tipoUtente', ruoloStr);
    this.ruoloUtente.next(ruoloStr);
    await this.router.navigate(["/home"]);
  }

  getUserRole(): Observable<string | null> {
    return this.ruoloUtente.asObservable();
  }

  getRuoliProfessionista():Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/api/auth/ruoliProfessionista`);
  }

  getUserId():number {
    const token = localStorage.getItem('token');
    if(!token) {
      return 0;
    }
    const decoded:any = jwtDecode(token!);
    return decoded.id;
  }

  register(ruolo:string, id_ruolo_professionista:number | null, nome:string, cognome:string, email:string, password:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/register`, {ruolo, id_ruolo_professionista, nome, cognome, email, password}, {observe: 'response'});
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
