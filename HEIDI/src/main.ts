import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { close, trash, eyeOutline, create, add, logOutOutline, personOutline, menuOutline, homeOutline, calendarOutline, peopleOutline, mailOutline} from 'ionicons/icons';

addIcons({
  close,
  trash,
  eyeOutline,
  create,
  add,
  logOutOutline,
  personOutline,
  menuOutline,
  homeOutline,
  calendarOutline,
  peopleOutline,
  mailOutline,
  'a': 'assets/icon/mountain_line_art.svg'
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient()
  ],
});
