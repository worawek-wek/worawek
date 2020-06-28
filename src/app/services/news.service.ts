import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INews, IResponse } from '../interfaces/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  apiName = 'news/';
  apiUrl = environment.apiUrl;
  Url = this.apiUrl+this.apiName;

  constructor(private http: HttpClient) { }
  getNews(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filters: Array<{ key: string; value: string }>
  ): Observable<{ data: INews[] }> {
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
    return this.http.get<{ data: INews[] }>(`${this.Url}`, { params });
  }
  getAutocomplete(){
    // return this.http.get(this.Url+'autocomplete');
    return this.http.get<{ data: INews[] }>(`${this.Url+'autocomplete'}`);
  }
  insertNews(formData: FormData){
    return this.http.post<IResponse>(this.Url, formData);
  }
  updateNews(formData, idEdit){
    return this.http.put<IResponse>(this.Url+idEdit, formData);
  }
  editNews(idEdit){
    return this.http.get<INews>(this.Url+idEdit+'/edit');
    // return this.http.get();
  }
  activeNews(form, id){
    return this.http.put(this.Url+id,form);
  }
  deleteNews(idDelete){
    return this.http.delete<IResponse>(this.Url+idDelete);
  }
}
