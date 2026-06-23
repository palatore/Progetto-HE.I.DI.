import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GestioneUtentiService {

  private apiUrl:string = "http://localhost:3000"; //sostituire con l'url corretto poi

  constructor(private http:HttpClient) {}


  creaInfo(){
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    console.log('GESTIONE UTENTI: cerco di gestire:', token, headers);
    return this.http.post<any>(`${this.apiUrl}/api/users/utente/creaInfo`, {token}, {headers, observe: 'response'});
  }

  riempiInfo(info:any){
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/api/users/utente/riempiInfo`, {info}, {headers, observe: 'response'});
  }

  aggiornaEta(eta:number){
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/api/users/utente/aggiornaEta`, {eta}, {headers, observe: 'response'});
  }

  getUtenteById(id_utente:number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(`${this.apiUrl}/api/users/utente/${id_utente}`, {headers});
  }

  getInfoUtenteById(id_utente:number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(`${this.apiUrl}/api/users/infoUtente/${id_utente}`, {headers});

  }

  getUtentiByRuolo(ruolo:number) {
    return this.http.get<any[]>(`${this.apiUrl}/api/users/ruoli/${ruolo}`);
  }

  eliminaEta(id_utente:number){
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete<any>(`${this.apiUrl}/api/users/eliminaEta/${id_utente}`, {headers, observe: 'response'});
  }
  
}
