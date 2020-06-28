import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private location: Location,private msg: NzMessageService, private router: Router, private AuthService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        this.AuthService.logout()
          localStorage.setItem('redirect', this.location.path());
          this.router.navigateByUrl('adminmanage');
        // setTimeout(() => {
          // location.reload();
        // }, 2000);
      }
      const error = err.error.message || err.statusText;
      this.msg.error(error, {nzDuration:7000});
    return throwError(error);
  }));
  }
}
