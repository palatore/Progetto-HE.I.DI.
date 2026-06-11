import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

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
}
