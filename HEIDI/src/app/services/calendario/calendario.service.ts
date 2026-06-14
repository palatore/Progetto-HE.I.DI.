import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { AttCalendarioModel } from 'src/app/models/att-calendario.model';

@Injectable({
  providedIn: 'root',
})
export class CalendarioService {

  constructor(private http:HttpClient) {
  }

  private apiUrl:string = "http://localhost:3000"; //sostituire con l'url corretto poi

}
