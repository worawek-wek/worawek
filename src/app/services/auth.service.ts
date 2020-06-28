import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as moment from "moment";
import { environment } from '../../environments/environment';
// import 'rxjs/add/operator/map'
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiName = 'auth/';
  user_name = localStorage.getItem("user_name");
  Url = environment.apiUrl+this.apiName;

    constructor(private http: HttpClient) {

    }

    login(username:string, password:string ) {
        return this.http.post(this.Url+'login', {username, password})
            // .do(res => this.setSession));
            .pipe(tap(res =>{
                const expiresAt = moment().add(res['expires_at'],'second');
                localStorage.setItem('id_token', res['token']);
                localStorage.setItem('user_id', res['user']['id']);
                localStorage.setItem('user_name', res['user']['name']);
                localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
                this.user_name = res['user']['name'];
                }
            ));

            // .shareReplay();
    }

    // private setSession(authResult) {
    // }

    logedout() {
      return this.http.post(this.Url+'logout', {})
          // .do(res => this.setSession));
          .pipe(tap(res =>{
            localStorage.removeItem("id_token");
            localStorage.removeItem("user_id");
            localStorage.removeItem("user_name");
            localStorage.removeItem("expires_at");
              }
          ));
    }
    logout() {
      localStorage.removeItem("id_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_name");
      localStorage.removeItem("expires_at");
  }
    public isLoggedIn() {
        return moment().isBefore(this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration = localStorage.getItem("expires_at");
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }
}
