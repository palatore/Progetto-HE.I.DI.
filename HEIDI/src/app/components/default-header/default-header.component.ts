import { Component, Input} from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButton } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonButton, RouterModule]
})
export class DefaultHeaderComponent {

  constructor() {}

  @Input() page_title:string = '';

}
