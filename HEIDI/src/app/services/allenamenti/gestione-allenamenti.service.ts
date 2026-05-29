import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class GestioneAllenamentiService {

    private apiUrl:string = "http://localhost:3000"; //sostiturire con URL definitivo

    constructor(private http:HttpClient) { }

    creaAllenamenti(nome:string, giorno:Date) {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.post<any>(`${this.apiUrl}/api/allenamenti/creaAllenamenti`, { nome, giorno }, {headers, observe: 'response'});
    }

    eliminaAllenamento(id_allenamento:number){
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.delete<any>(`${this.apiUrl}/api/allenamenti/eliminaAllenamento/${id_allenamento}`, {headers, observe: 'response'});
    }

    getAllenamentiUtente(): Observable<any[]> {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.get<any>(`${this.apiUrl}/api/allenamenti/allenamentiUtente`, {headers});
    }
}