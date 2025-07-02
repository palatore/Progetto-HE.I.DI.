import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GestionePastiService {

  private apiUrl:String = "http://localhost:3000"; //sostituire con l'url corretto poi

  constructor(private http:HttpClient) { }

  creaPasti(nome:String, data:String, tipo:String) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/api/pasti/creaPasti`, { nome, data, tipo }, {headers, observe: 'response'});
  }

  riempiPasto(id_pasto:Number, alimenti:any[], bevande:any[]) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/api/pasti/riempiPasto`, { id_pasto, alimenti, bevande }, {headers, observe: 'response'});
  }

  checkPasto(nome:String, data:String, tipo:String) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/api/pasti/checkPasto`, { nome, data, tipo }, {headers});
  }

  getPastiUtente(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any[]>(`${this.apiUrl}/api/pasti/pastiUtente`, {headers});
  }
  
  getAlimenti() {
    return this.http.get<any[]>('http://localhost:3000/api/pasti/alimenti');
  }

}
