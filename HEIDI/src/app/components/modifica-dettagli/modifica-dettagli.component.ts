import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modifica-dettagli',
  templateUrl: './modifica-dettagli.component.html',
  styleUrls: ['./modifica-dettagli.component.scss'],
})
export class ModificaDettagliComponent  implements OnInit {

  constructor() { }

  @Input() isShow: boolean = false;
  @Input() foodBool: boolean = false;

  ngOnInit() {}

}
