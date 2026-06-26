import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonMenu, IonItem, IonList, IonHeader, IonButton, IonIcon, IonLabel, IonToolbar, IonContent, IonTitle, IonMenuToggle } from '@ionic/angular/standalone';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LoginService } from './services/auth/login.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonMenu, IonMenuToggle,IonItem, IonList, IonHeader, IonButton, IonIcon, IonLabel, IonToolbar, IonContent, IonTitle, RouterLink],
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private authService:LoginService) {}

  ngOnInit() {
    // Monitora i cambi di rotta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageVisibility();
      });

    // Esegui al primo caricamento
    this.updatePageVisibility();
  }

  private updatePageVisibility() {
  const routerOutlet = document.querySelector('ion-router-outlet');
  if (!routerOutlet) return;
  
  // Seleziona TUTTI i componenti direttamente nel router outlet
  const allPages = routerOutlet.querySelectorAll(':scope > *');
    
    allPages.forEach((page, index) => {
      if (index === allPages.length - 1) {
        // Pagina attiva
        page.removeAttribute('ion-page-hidden');
        page.removeAttribute('aria-hidden');
      } else {
        // Pagina inattiva - nascondi
        page.setAttribute('ion-page-hidden', '');
        page.setAttribute('aria-hidden', 'true');
        
        // Blur degli elementi con focus in questa pagina
        const focusedElement = page.querySelector(':focus');
        if (focusedElement instanceof HTMLElement) {
          focusedElement.blur();
        }
      }
    });
  }

  async onLogout() {
   await this.authService.onLogoutSuccess();
  }
}
