import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface InvoiceResource {
  id: number;
  amount: number;
  description: string;
  filePath: string;
  userId: number;
  issuedAt: string;
}

export interface CreateInvoicePayload {
  totalAmount: number;
  concept: string;
  userId: number;
}

@Injectable({ providedIn: 'root' })
export class InvoiceService {

  private readonly baseUrl = environment.baseUrl;
  private readonly jsonHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  createInvoice(payload: CreateInvoicePayload): Observable<InvoiceResource> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<InvoiceResource>(
      `${this.baseUrl}/api/v2/invoices`,
      payload,
      { headers }
    );
  }
}
