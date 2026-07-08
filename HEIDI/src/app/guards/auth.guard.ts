import {Injectable} from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../services/auth/login.service';
import {firstValueFrom} from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

    async canActivate(): Promise<boolean> {
        const ruoloUtente = await firstValueFrom(this.loginService.getUserRole().pipe(filter(role => role !== null), map(role => role !== null)));

        if (ruoloUtente) {
            return true; 
        } else {
            await this.router.navigate(['/login']);
            return false;
        }
    }
}