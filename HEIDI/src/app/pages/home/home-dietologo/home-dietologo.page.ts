import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home-dietologo',
  templateUrl: './home-dietologo.page.html',
  styleUrls: ['./home-dietologo.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HomeDietologoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
