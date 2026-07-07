import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class GestioneBachecaService {

  private apiUrl:string = "http://localhost:3000"; //sostituire con l'url corretto poi

  constructor(private http:HttpClient) {}

  getPastiBacheca():Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(`${this.apiUrl}/api/bacheca/pastiBacheca`, {headers});
  }

  getAllenamentiBacheca():Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(`${this.apiUrl}/api/bacheca/allenamentiBacheca`, {headers});
  }

  getVotiAttivita(id_attivita:number, tipologia_attivita:number):Observable<any[]> {
    const token = localStorage.getItem('token');
    const oggOpzioni = {
      headers: { 
        Authorization: `Bearer ${token}` 
      },
      params: {
        id_attivita: id_attivita.toString(),
        tipologia_attivita: tipologia_attivita.toString()
      }
    };
    return this.http.get<any>(`${this.apiUrl}/api/bacheca/votiAttivita`, oggOpzioni);
  }

  getSingolaAttivitaBacheca(id_attivita:number, tipologia_attivita:number):Observable<any> {
    const token = localStorage.getItem('token');
    const oggOpzioni = {
      headers: { 
        Authorization: `Bearer ${token}` 
      },
      params: {
        id_attivita: id_attivita.toString(),
        tipologia_attivita: tipologia_attivita.toString()
      }
    };
    return this.http.get<any>(`${this.apiUrl}/api/bacheca/singolaAttivita`, oggOpzioni);

  }

  condividiAttivita(id_attivita:number, tipologia_attivita:number) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/api/bacheca/condividiAttivita`, {id_attivita, tipologia_attivita}, {headers, observe: 'response'});
  }

  votaAttivita(attivita: {id:number, valutazione:number, tipologia:number}):Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/api/bacheca/votaAttivita`, {attivita}, {headers, observe: 'response'});
  }
}