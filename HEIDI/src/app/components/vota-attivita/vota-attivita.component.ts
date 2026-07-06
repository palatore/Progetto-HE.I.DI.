import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-vota-attivita',
  templateUrl: './vota-attivita.component.html',
  styleUrls: ['./vota-attivita.component.scss'],
})
export class VotaAttivitaComponent  implements OnInit {

  @Input() voto_attuale = 0;

  @Output() voto_inviato = new EventEmitter<number>;

  public stelle = [1, 2, 3, 4, 5];

  constructor() { }

  ngOnInit() {}

  selezionaStella(index:number) {
    if(this.voto_attuale === index - 0.5) {
      this.voto_attuale = index;
    } else if(this.voto_attuale === index) {
      this.voto_attuale = index -1;
    } else {
      this.voto_attuale = index - 0.5;
    }
  }

  getIconaStella(index:number) {
    
  }

}
