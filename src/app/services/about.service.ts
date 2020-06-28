import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IAbout, IResponse } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  apiName = 'about/';
  apiUrl = environment.apiUrl;
  Url = this.apiUrl+this.apiName;

  constructor(private http: HttpClient) { }

  getAbout(){
    // return this.http.get(this.Url);
    return this.http.get<{ data: IAbout }>(`${this.Url}`);
  }

  getToWeb(){
    return this.http.get(this.Url+'getToWeb');
  }

  updateAbout(formData, idEdit){
    return this.http.put<IResponse>(this.Url+idEdit, formData);
  }
}
