import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GestioneUtentiService {

  private apiUrl:string = "http://localhost:3000"; //sostituire con l'url corretto poi

  constructor(private http:HttpClient) {}

  aggiornaPassword(id_utente:number, nuovaPassword:string) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/api/users/utente/aggiornaPassword/${id_utente}`, {nuovaPassword}, {headers, observe: 'response'});
  }

  creaInfo(){
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/api/users/utente/creaInfo`, {token}, {headers, observe: 'response'});
  }

  riempiInfo(info:any){
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/api/users/utente/riempiInfo`, {info}, {headers, observe: 'response'});
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

  getRuoloProfessionista(id_professionista:number):Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(`${this.apiUrl}/api/users/ruoloProfessionista/${id_professionista}`, {headers});
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
    return this.http.get<any>(`${this.apiUrl}/api/users/votiAttivita`, oggOpzioni);
  }

  getAssociazioniUtente():Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any[]>(`${this.apiUrl}/api/users/associazioniUtente`, {headers});
  }

  getAssociazioniProfessionista():Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any[]>(`${this.apiUrl}/api/users/associazioniProfessionista`, {headers});
  }

  getRichiesteUtente():Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any[]>(`${this.apiUrl}/api/users/richiesteUtente`, {headers});
  }

  getRichiesteProfessionista():Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any[]>(`${this.apiUrl}/api/users/richiesteProfessionista`, {headers});
  }

  getAssociazioniPending():Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any[]>(`${this.apiUrl}/api/users/associazioniPending`, {headers});
  }

  getRichiestePending():Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any[]>(`${this.apiUrl}/api/users/richiestePending`, {headers});
  }

  votaAttivita(attivita: {id:number, valutazione:number, tipologia:number}):Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/api/users/votaAttivita`, {attivita}, {headers, observe: 'response'});
  }

  creaAssociazione(id_persona:number):Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/api/users/creaAssociazione`, {id_persona}, {headers, observe: 'response'});
  }

  creaRichiesta(dati:any):Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/api/users/creaRichiesta`, {dati}, {headers, observe: 'response'});

  }

  accettaAssociazione(id_associazione:number):Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.patch<any>(`${this.apiUrl}/api/users/accettaAssociazione`, {id_associazione}, {headers, observe: 'response'});
  }

  accettaRichiesta(richiesta: {id:number, id_att:number, tipologia:number, tipo:string}):Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.patch<any>(`${this.apiUrl}/api/users/accettaRichiesta`, {richiesta}, {headers, observe: 'response'});
  }

  annullaAssociazione(id_associazione:number):Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete<any>(`${this.apiUrl}/api/users/annullaAssociazione/${id_associazione}`, {headers, observe: 'response'});
  }

  annullaRichiesta(id_richiesta:number):Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete<any>(`${this.apiUrl}/api/users/annullaRichiesta/${id_richiesta}`, {headers, observe: 'response'});
  }

  eliminaEta(id_utente:number){
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete<any>(`${this.apiUrl}/api/users/eliminaEta/${id_utente}`, {headers, observe: 'response'});
  }
  
}
