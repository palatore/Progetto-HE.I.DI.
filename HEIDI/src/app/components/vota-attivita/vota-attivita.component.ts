import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-vota-attivita',
  templateUrl: './vota-attivita.component.html',
  styleUrls: ['./vota-attivita.component.scss'],
  imports: [IonIcon, IonButton]
})
export class VotaAttivitaComponent  implements OnInit {

  public voto_attuale = 0;

  @Input() devo_votare:boolean = true;
  @Input() voto_precedente = 0;
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

  getIconaStella(index:number):string {
    if(this.devo_votare) {
      if(this.voto_attuale >= index) {
        return 'star';
      } else if(this.voto_attuale >= index - 0.5) {
        return 'star-half-outline';
      } else {
        return 'star-outline';
      }
    } else {
      if(this.voto_precedente >= index) {
        return 'star';
      } else if(this.voto_precedente >= index - 0.5) {
        return 'star-half-outline';
      } else {
        return 'star-outline';
      }
    }
  }

  confermaVoto() {
    this.voto_inviato.emit(this.voto_attuale);
  }

}
