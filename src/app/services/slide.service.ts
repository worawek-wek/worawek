import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ISlide, IResponse } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SlideService {
  apiName = 'slide/';
  apiUrl = environment.apiUrl;
  Url = this.apiUrl+this.apiName;

  getSlides(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filters: Array<{ key: string; value: string }>
  ): Observable<{ data: ISlide[] }> {
    let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('pageSize', `${pageSize}`)
      .append('sortField', `${sortField}`)
      .append('sortOrder', `${sortOrder}`);

    filters.forEach(filter => {
      // filter.value.forEach(value => {
        params = params.append(filter.key, filter.value);
      // });
    });
    // console.log(params);
    return this.http.get<{ data: ISlide[] }>(`${this.Url}`, { params });
  }
  getToWeb(){
    return this.http.get(this.Url+'getToWeb');
  }
  getAutocomplete(){
    return this.http.get(this.Url+'autocomplete');
  }
  insertSlide(formData: FormData){
    return this.http.post<IResponse>(this.Url, formData);
  }
  updateSlide(formData, idEdit){
    return this.http.put<IResponse>(this.Url+idEdit, formData);
  }
  activeSlide(event, id){
    return this.http.put(this.Url+id,{active:event});
  }
  deleteSlide(idDelete){
    return this.http.delete<IResponse>(this.Url+idDelete);
  }

  constructor(private http: HttpClient) {}
}
