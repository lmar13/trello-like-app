import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserIsAuthorizeGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.handleActivation();
  }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    return this.handleActivation();
  }

  private handleActivation(): boolean | Promise<boolean> {
    const user = this.authService.decToken;


    // if (user) {
    //   if (user.SYSTEM_ROLE !== 'ROLE_SYSTEM_ADMIN') {
    //     // this.router.navigate(['/solutions']);
    //     return false;
    //   }
      return true;
    // }
    // return false;
  }
}
