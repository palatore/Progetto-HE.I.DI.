import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GestionePastiService {

  private apiUrl:String = "http://localhost:3000"; //sostituire con l'url corretto poi

  constructor(private http:HttpClient) { }

  creaPasto(nome:String, data:String, tipo:String) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/creaPasti`, { nome, data, tipo }, {headers, observe: 'response'});
  }

  checkPasto(nome:String, data:String, tipo:String) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/checkPasto`, { nome, data, tipo }, {headers});
  }
  
  getAlimenti() {
    return this.http.get<any[]>('http://localhost:3000/alimenti');
  }

}
