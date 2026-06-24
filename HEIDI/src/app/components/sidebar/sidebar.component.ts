import { Component, OnInit, Input } from '@angular/core';
import { IonList, IonListHeader, IonItem, IonLabel, IonIcon , IonButton} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [IonList, IonListHeader, IonItem, IonLabel, IonIcon, IonButton, RouterModule]
})
export class SidebarComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  @Input() isShow:boolean = false;

}
