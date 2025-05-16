import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoriesObjectsService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {
  }

  getCategoriesObjects():Observable<any>{
    return this.http.get(`${this.baseUrl}/categories-objects`)
  }
}
