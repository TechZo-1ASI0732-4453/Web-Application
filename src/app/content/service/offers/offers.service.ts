import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Offers } from '../../model/offers/offers.model';

@Injectable({ providedIn: 'root' })
export class OffersService {
  private readonly baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  private auth() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      })
    };
  }

  getOffers(): Observable<Offers[]> {
    return this.http.get<Offers[]>(`${this.baseUrl}/api/v2/exchanges`, this.auth());
  }

  updateOfferStatus(exchangeId: string, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/v2/exchanges/status/${exchangeId}`, { status }, this.auth());
  }

  postOffer(offer: Offers): Observable<Offers> {
    const body = {
      productOwnId:    +offer.id_product_offers,
      productChangeId: +offer.id_product_get,
      status:          offer.status
    };
    return this.http.post<Offers>(
      `${this.baseUrl}/api/v2/exchanges`,
      body,
      this.auth()
    );
  }
  getAllOffersByUserOwnId(id: string): Observable<Offers[]> {
    return this.http.get<Offers[]>(`${this.baseUrl}/api/v2/exchanges/userOwn/${id}`, this.auth());
  }

  getAllOffersByUserChangeId(id: string): Observable<Offers[]> {
    return this.http.get<Offers[]>(
      `${this.baseUrl}/api/v2/exchanges/userChange/${id}`,
      this.auth()
    );
  }

  getFinishedByUserId(id: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/api/v2/exchanges/finished/${id}`,
      this.auth()
    );
  }
}
