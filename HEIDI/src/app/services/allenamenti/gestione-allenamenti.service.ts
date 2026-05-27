import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class GestioneAllenamentiService {

    private apiUrl:String = "http://localhost:3000"; //sostiturire con URL definitivo

    constructor(private http:HttpClient) { }

    creaAllenamenti(nome:String, giorno:Date) {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.post<any>(`${this.apiUrl}/api/allenamenti/creaAllenamenti`, { nome, giorno }, {headers, observe: 'response'});
    }
}