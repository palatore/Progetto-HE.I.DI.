import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GestioneUtentiService {

  private apiUrl:string = "http://localhost:3000"; //sostituire con l'url corretto poi

  constructor(private http:HttpClient) {}

  getUtenteById(id_utente:number) {
    return this.http.get<any[]>(`${this.apiUrl}/api/users/utente/${id_utente}`);
  }

  getUtentiByRuolo(ruolo:number) {
    return this.http.get<any[]>(`${this.apiUrl}/api/users/ruoli/${ruolo}`);
  }
  
}
