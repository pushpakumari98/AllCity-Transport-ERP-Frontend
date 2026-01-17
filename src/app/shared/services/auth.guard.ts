import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Appservice } from '../../myservice/appservice';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private appService: Appservice, private router: Router) {}

  canActivate(): boolean {
    if (this.appService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(private appService: Appservice, private router: Router) {}

  canActivate(): boolean {
    if (this.appService.isAuthenticated()) {
      this.router.navigate(['/app/dashboard']);
      return false;
    } else {
      return true;
    }
  }
}
