import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { DataPageService } from '../services/data-page.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private location: Location,private AuthService: AuthService, public router: Router, private DataPageService: DataPageService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.DataPageService.admin = false;
      if (this.AuthService.isLoggedIn()) {
          this.router.navigate([localStorage.getItem('redirect')||"manage/slide"]);
          localStorage.removeItem('redirect');

          return false;
        }
        return true;
  }

}
