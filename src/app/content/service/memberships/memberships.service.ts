import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {forkJoin, mergeMap, Observable} from 'rxjs';
import {Memberships} from "../../model/memberships/memberships.model";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MembershipsService {
  baseUrl = environment.baseUrl;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  // Memberships endpoints
  getMemberships(): Observable<Memberships[]> {
    return this.http.get<Memberships[]>(`${this.baseUrl}/api/v2/membership`);
  }

  getMembershipsWithBenefits(): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/api/v2/membership`).pipe(
      mergeMap((memberships: any[]) => {
        const requests = memberships.map(membership =>
          this.getBenefitsByMembershipId(membership.id).pipe(
            // Transformar el resultado para incluir los beneficios en cada membresía
            map(benefits => ({
              ...membership,
              benefits: benefits.map((benefit: { description: string }) => benefit.description)
            }))
          )
        );
        return forkJoin(requests);
      })
    );
  }

  postMembership(data: Memberships): Observable<Memberships> {
    return this.http.post<Memberships>(`${this.baseUrl}/api/v2/membership`, data, { headers: this.headers });
  }

  deleteMembership(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/v2/membership/delete/${id}`, { headers: this.headers });
  }

  putMembership(id: string, data: Memberships): Observable<Memberships> {
    return this.http.put<Memberships>(`${this.baseUrl}/api/v2/membership/${id}`, data, { headers: this.headers });
  }

  getMembershipById(id: string): Observable<Memberships> {
    return this.http.get<Memberships>(`${this.baseUrl}/api/v2/membership/${id}`, { headers: this.headers });
  }

  // Benefits endpoints
  getBenefits(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/v2/benefits`, { headers: this.headers });
  }

  postBenefit(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/v2/benefits`, data, { headers: this.headers });
  }

  deleteBenefit(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/v2/benefits/delete/${id}`, { headers: this.headers });
  }

  getBenefitById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/v2/benefits/${id}`, { headers: this.headers });
  }

  getBenefitsByMembershipId(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/v2/benefits/membership/${id}`, { headers: this.headers });
  }
}
