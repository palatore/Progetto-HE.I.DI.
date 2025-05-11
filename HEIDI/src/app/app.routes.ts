import { Routes } from '@angular/router';

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
    loadComponent: () => import('./pages/home/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'homeDietologo',
    loadComponent: () => import('./pages/home/home-dietologo/home-dietologo.page').then( m => m.HomeDietologoPage)
  },
];
