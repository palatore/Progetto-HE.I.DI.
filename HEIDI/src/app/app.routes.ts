import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path:'',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home/home.page').then( m => m.HomePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'registrazione',
    loadComponent: () => import('./pages/auth/registrazione/registrazione.page').then( m => m.RegistrazionePage)
  },
  {
    path: 'creazionePasto',
    loadComponent: () => import('./pages/utente/creazione-pasto/creazione-pasto.page').then( m => m.CreazionePastoPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'pastiUtente',
    loadComponent: () => import('./pages/pasti/pasti-utente/pasti-utente.page').then( m => m.PastiUtentePage)
  },
  {
    path: 'creazioneAllenamento',
    loadComponent: () => import('./pages/utente/creazione-allenamento/creazione-allenamento.page').then( m => m.CreazioneAllenamentoPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'allenamentiUtente',
    loadComponent: () => import('./pages/allenamenti/allenamenti-utente/allenamenti-utente.page').then(m => m.AllenamentiUtentePage),
    canActivate: [AuthGuard]
  },

  /*SOLO PER PREPARAZIONE DEL FORM DELL'ALLENAMENTO
  {
    path: 'testRiempiAllenamento',
    loadComponent: () => import('./pages/utente/creazione-allenamento/riempi-allenamento/riempi-allenamento.component').then(m => m.RiempiAllenamentoComponent)
  }, */

];
