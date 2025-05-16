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
    return this.http.get<Memberships[]>(`${this.baseUrl}/api/v2/plans`);
  }

  putSubscriptionStatus(subscriptionId: number, body: { state: string, planId: number, userId: number }): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/v2/subscriptions/status/${subscriptionId}`, body, { headers: this.headers });
  }

  getMembershipsWithBenefits(): Observable<Memberships[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/v2/plans`).pipe(
      map((memberships: any[]) => {
        return memberships.map(membership => {
          // Extraemos solo las descripciones de los beneficios
          const benefitDescriptions = membership.benefits.map((benefit: { description: string }) => benefit.description);
          // Devolvemos la membresía con los beneficios
          return {
            ...membership,
            benefits: benefitDescriptions
          };
        });
      })
    );
  }

  postMembership(data: Memberships): Observable<Memberships> {
    return this.http.post<Memberships>(`${this.baseUrl}/api/v2/plans`, data, { headers: this.headers });
  }

  deleteMembership(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/v2/plans/delete/${id}`, { headers: this.headers });
  }

  putMembership(id: string, data: Memberships): Observable<Memberships> {
    return this.http.put<Memberships>(`${this.baseUrl}/api/v2/plans/${id}`, data, { headers: this.headers });
  }

  getMembershipById(id: string): Observable<Memberships> {
    return this.http.get<Memberships>(`${this.baseUrl}/api/v2/plans/${id}`, { headers: this.headers });
  }

  getBenefitsByMembershipId(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/v2/benefits/membership/${id}`, { headers: this.headers });
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

  getUserMembership(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/v2/subscriptions/user/${userId}`, { headers: this.headers });
  }

  createSubscription(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/v2/subscriptions`, payload, { headers: this.headers });
  }


}
