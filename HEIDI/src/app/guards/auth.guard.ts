import {Injectable} from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../services/auth/login.service';
import {firstValueFrom} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

    async canActivate(): Promise<boolean> {
        const ruoloUtente = await firstValueFrom(this.loginService.getUserRole().pipe(map(role => role !== null)));

        if (ruoloUtente) {
            return true; // L'utente è autenticato, consenti l'accesso
        } else {
            await this.router.navigate(['/login']); // L'utente non è autenticato, reindirizza al login
            return false;
        }
    }
}