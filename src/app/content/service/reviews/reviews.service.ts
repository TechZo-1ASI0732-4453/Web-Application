import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Reviews} from "../../model/reviews/reviews.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  baseUrl= environment.baseUrl;
  constructor(private http:HttpClient) { }

  getReviews(){
    return this.http.get(`${this.baseUrl}/api/v2/reviews`)
  }

  postReview(data: any): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/reviews`, data)
  }
}
