import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Pasto } from 'src/app/models/pasto.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GestionePastiService {

  private apiUrl:String = environment.apiUrl;

  constructor(private http:HttpClient) {}

  creaPasti(nome:string, tipo:string, data_creazione:string) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/api/pasti/creaPasti`, { nome, tipo, data_creazione}, {headers, observe: 'response'});
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

  programmaPasto(id_pasto:number, data_calendario:string) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/api/pasti/programmaPasto`, {id_pasto, data_calendario }, {headers, observe: 'response'});
  }

  clonaPasto(id_pasto:number) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/api/pasti/clonaPasto`, {id_pasto}, {headers, observe: 'response'});
  }

  disdiciPasto(id_pasto:number, data_calendario:string) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete<any>(`${this.apiUrl}/api/pasti/disdiciPasto`, {headers, observe: 'response', body: {id_pasto, data_calendario }});
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

  getPastiUtente(): Observable<Pasto[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Pasto[]>(`${this.apiUrl}/api/pasti/pastiUtente`, {headers});
  }

  getPastiProgrammati():Observable<Pasto[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Pasto[]>(`${this.apiUrl}/api/pasti/pastiProgrammati`, {headers});
  }

  getDettagliPasto(id_pasto:number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(`${this.apiUrl}/api/pasti/dettagliPasto/${id_pasto}`, {headers});
  }

  getPastoById(id_pasto:number):Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(`${this.apiUrl}/api/pasti/pasto/${id_pasto}`, {headers});
  }
  
  getAlimenti() {
    return this.http.get<any[]>(`${this.apiUrl}/api/pasti/alimenti`);
  }

  getAlimentoById(id_alimento:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/pasti/alimento/${id_alimento}`);
  }

}
