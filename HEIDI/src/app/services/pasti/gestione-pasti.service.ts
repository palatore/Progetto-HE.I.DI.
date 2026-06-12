import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GestionePastiService {

  private apiUrl:string = "http://localhost:3000"; //sostituire con l'url corretto poi

  constructor(private http:HttpClient) { }

  creaPasti(nome:string, tipo:string) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/api/pasti/creaPasti`, { nome, tipo }, {headers, observe: 'response'});
  }

  riempiPasto(id_pasto:number, alimenti:any[]) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/api/pasti/riempiPasto`, { id_pasto, alimenti}, {headers, observe: 'response'});
  }

  modificaPasto(id_pasto:number, modifiche_pasto: any[]) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/api/pasti/modificaPasto`, {id_pasto, modifiche_pasto}, {headers, observe: 'response'});
  }

  eliminaPasto(id_pasto:number) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete<any>(`${this.apiUrl}/api/pasti/eliminaPasto/${id_pasto}`, {headers, observe: 'response'});
  }

  checkPasto(nome:String, tipo:string) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/api/pasti/checkPasto`, { nome, tipo }, {headers});
  }

  getPastiUtente(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any[]>(`${this.apiUrl}/api/pasti/pastiUtente`, {headers});
  }

  getDettagliPasto(id_pasto:number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(`${this.apiUrl}/api/pasti/dettagliPasto/${id_pasto}`, {headers});
  }
  
  getAlimenti() {
    return this.http.get<any[]>('http://localhost:3000/api/pasti/alimenti');
  }

  getAlimentoById(id_alimento:number): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/pasti/alimento/${id_alimento}`);
  }

}
