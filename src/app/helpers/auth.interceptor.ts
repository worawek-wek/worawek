import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private AuthService: AuthService) {}
  // intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  //   return next.handle(request);
  // }  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // this.router.navigateByUrl('adminmanage');
    if(this.AuthService.isLoggedIn()){
      const idToken = localStorage.getItem("id_token");
      if (idToken) {
        const cloned = req.clone({ 
            headers: req.headers.set("Authorization",
                "Bearer " + idToken)
        });
        return next.handle(cloned);
      }
    }
    return next.handle(req); 
  }
}
