import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IUpload } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  apiName = '';
  apiUrl = environment.apiUrl;
  Url = this.apiUrl+this.apiName;

  constructor(private http: HttpClient) { }

  uploadImage(formData){
    return this.http.post<IUpload>(this.Url+'uploadImage', formData);
  }
}
