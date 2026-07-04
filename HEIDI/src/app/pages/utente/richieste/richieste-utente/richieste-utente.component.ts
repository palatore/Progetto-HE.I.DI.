import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-richieste-utente',
  templateUrl: './richieste-utente.component.html',
  styleUrls: ['./richieste-utente.component.scss'],
})
export class RichiesteUtenteComponent  implements OnInit {

  @Input() richieste_utente:any[] = [];
  

  constructor() { }

  ngOnInit() {}

}
