import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct, IResponse } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiName = 'product/';
  apiUrl = environment.apiUrl;
  Url = this.apiUrl+this.apiName;
  constructor(private http: HttpClient) { }
  getProduct(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filters: Array<{ key: string; value: string }>
  ): Observable<{ data: IProduct[] }> {
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
    return this.http.get<{ data: IProduct[] }>(`${this.Url}`, { params });
  }
  getAutocomplete(req){
    let params = new HttpParams().append('feild', req);
    // return this.http.get(this.Url+'autocomplete');
    return this.http.get<{data:IProduct[]}>(`${this.Url+'autocomplete'}`,{params});
  }
  insertProduct(formData: FormData){
    return this.http.post<IResponse>(this.Url, formData);
  }
  updateProduct(formData, idEdit){
    return this.http.put<IResponse>(this.Url+idEdit, formData);
  }
  getEditProduct(idEdit){
    return this.http.get<IProduct>(this.Url+idEdit+'/edit');
    // return this.http.get();
  }
  // activeProduct(form, id){
  //   return this.http.put(this.Url+id,form);
  // }
  deleteProduct(idDelete){
    return this.http.delete<IResponse>(this.Url+idDelete);
  }
  addStock(id,formData){
    return this.http.put<IResponse>(this.Url+'addStock/'+id, formData);
  }
}
