import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {Offers} from "../../model/offers/offers.model";

@Injectable({
  providedIn: 'root'
})
export class OffersService {
   baseUrl= environment.baseUrl;
  constructor(private http:HttpClient) { }


  getOffers(){
    return this.http.get(`${this.baseUrl}/api/v2/exchanges`)
  }

  updateOfferStatus(id: string, status: string): Observable<any> {
    const url = `${this.baseUrl}/api/v2/exchanges/status/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { status: status };
    return this.http.put(url, body, { headers: headers });
  }

  postOffer(offer: Offers): Observable<Offers> {
    return this.http.post<Offers>(`${this.baseUrl}/api/v2/exchanges`, offer);
  }

  getAllOffersByUserOwnId(id: string): Observable<Offers> {
    return this.http.get<Offers>(`${this.baseUrl}/api/v2/exchanges/user-own/${id}`);
  }

  getAllOffersByUserChangeId(id: string): Observable<Offers> {
    return this.http.get<Offers>(`${this.baseUrl}/api/v2/exchanges/user-change/${id}`);
  }


}
