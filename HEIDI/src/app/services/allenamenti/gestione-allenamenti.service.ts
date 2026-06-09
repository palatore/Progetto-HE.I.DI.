import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class GestioneAllenamentiService {

    private apiUrl:string = "http://localhost:3000"; //sostiturire con URL definitivo

    constructor(private http:HttpClient) { }

    creaAllenamenti(nome:string, giorno:string, durata:number) {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.post<any>(`${this.apiUrl}/api/allenamenti/creaAllenamenti`, { nome, giorno, durata }, {headers, observe: 'response'});
    }

    riempiAllenamento(id_allenamento:number, esercizi:any[]){
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.post<any>(`${this.apiUrl}/api/allenamenti/riempiAllenamento`, {id_allenamento, esercizi}, {headers, observe: 'response'});
    }

    eliminaAllenamento(id_allenamento:number){
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.delete<any>(`${this.apiUrl}/api/allenamenti/eliminaAllenamento/${id_allenamento}`, {headers, observe: 'response'});
    }

    checkAllenamento(giorno:string){
        console.log('I dati che passo:', giorno);
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.post<any>(`${this.apiUrl}/api/allenamenti/checkAllenamento`, { giorno }, {headers});
    }

    getAllenamentiUtente(): Observable<any[]> {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.get<any>(`${this.apiUrl}/api/allenamenti/allenamentiUtente`, {headers});
    }

    getEsercizi() {
        return this.http.get<any[]>('http://localhost:3000/api/allenamenti/esercizi');
    }

    getEsercizioById(id_esercizio:number): Observable<any> {
        return this.http.get<any>(`http://localhost:3000/api/allenamenti/esercizio/${id_esercizio}`);
    }
}