import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {catchError, forkJoin, Observable, of, shareReplay, switchMap, tap, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class OngsService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  private withAuth() {
    const t = localStorage.getItem('token');
    return t ? { headers: new HttpHeaders({ Authorization: `Bearer ${t}` }) } : {};
  }


  /********************* ONGs **************************/

  getOngs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/v2/donations/ongs`, this.withAuth()).pipe(
      switchMap(ongs =>
        forkJoin(
          ongs.map(ong =>
            forkJoin({
              projects: this.http
                .get(`${this.baseUrl}/api/v2/donations/projects/ongs/${ong.id}`, this.withAuth())
                .pipe(catchError(() => of([])), shareReplay(1)),
              social_networks: this.http
                .get(`${this.baseUrl}/api/v2/donations/social-networks/ongs/${ong.id}`, this.withAuth())
                .pipe(catchError(() => of([])), shareReplay(1)),
              account_numbers: this.http
                .get(`${this.baseUrl}/api/v2/donations/account-number/ongs/${ong.id}`, this.withAuth())
                .pipe(catchError(() => of([])), shareReplay(1))
            }).pipe(
              map(res => {
                ong.projects = res.projects;
                ong.social_networks = res.social_networks;
                ong.account_numbers = res.account_numbers;
                return this.transformOng(ong);
              })
            )
          )
        )
      ),
      catchError(this.handleError)
    );
  }

  postOng(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/v2/ongs`, this.transformToNewStructure(data)).pipe(
      catchError(this.handleError)
    );
  }

  deleteOng(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/v2/ongs/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  putOng(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/v2/ongs/edit/${id}`, this.transformToNewStructure(data)).pipe(
      catchError(this.handleError)
    );
  }

  getOngById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/v2/donations/ongs/${id}`, this.withAuth()).pipe(
      switchMap(ong =>
        forkJoin({
          projects: this.http
            .get(`${this.baseUrl}/api/v2/donations/projects/ongs/${id}`, this.withAuth())
            .pipe(catchError(() => of([]))),
          social_networks: this.http
            .get(`${this.baseUrl}/api/v2/donations/social-networks/ongs/${id}`, this.withAuth())
            .pipe(catchError(() => of([]))),
          account_numbers: this.http
            .get(`${this.baseUrl}/api/v2/donations/account-number/ongs/${id}`, this.withAuth())
            .pipe(catchError(() => of([])))
        }).pipe(
          map(res => {
            ong.projects = res.projects;
            ong.social_networks = res.social_networks;
            ong.account_numbers = res.account_numbers;
            return this.transformOng(ong);
          })
        )
      ),
      catchError(this.handleError)
    );
  }

  /********************* Account Numbers **************************/

  postAccountNumber(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/v2/account-number`, data).pipe(
      catchError(this.handleError)
    );
  }

  getAccountNumberById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/v2/account-number/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getAccountNumbersByOngId(ongId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/v2/account-number/ongs/${ongId}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteAccountNumber(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/v2/account-number/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /********************* Projects **************************/

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/v2/projects`).pipe(
      catchError(this.handleError)
    );
  }

  postProject(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/v2/projects`, data).pipe(
      catchError(this.handleError)
    );
  }

  getProjectById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/v2/projects/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getProjectsByOngId(ongId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/v2/projects/ongs/${ongId}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/v2/projects/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /********************* Social Networks **************************/

  getSocialNetworks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/v2/social-networks`).pipe(
      catchError(this.handleError)
    );
  }

  postSocialNetwork(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/v2/social-networks`, data).pipe(
      catchError(this.handleError)
    );
  }

  getSocialNetworkById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/v2/social-networks/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getSocialNetworksByOngId(ongId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/v2/social-networks/ongs/${ongId}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteSocialNetwork(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/v2/social-networks/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  /***************** ONGs Categories **************************/


  getCategoriesOngs(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/api/v2/donations/category-ongs`, this.withAuth())
      .pipe(catchError(this.handleError));
  }

  postCategoryOng(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/v2/donations/category-ongs`, data).pipe(
      catchError(this.handleError)
    );
  }

  deleteCategoryOng(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/v2/donations/category-ongs/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  putCategoryOng(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/v2/donations/category-ongs/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  getCategoryOngById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/v2/category-ongs/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  getCategoryNameById(id: number): Observable<string> {
    return this.http.get<any>(`${this.baseUrl}/api/v2/category-ongs/${id}`).pipe(
      map(category => category.name),
      catchError(this.handleError)
    );
  }

  private transformOng(data: any): any {
    const transformedAddress = this.transformAddress(data.address);
    return {
      name: data.name,
      type: data.type,
      information: [{
        about: data.aboutUs,
        mission_vision: data.missionAndVision,
        forms_of_support: data.supportForm
      }],
      projects: data.projects,
      account_number: data.account_numbers,
      address: transformedAddress,
      category: data.categoryOngId,
      email: data.email,
      contact_number: data.phone,
      attention_schedule: [{ schedule: data.schedule }],
      logo: data.logo,
      website: data.website,
      social_networks: data.social_networks,
      id: data.id
    };
  }
  private transformToNewStructure(data: any): any {
    return {
      id: parseInt(data.id, 10),
      name: data.name,
      type: data.type,
      about_us: data.information[0].about,
      mission_and_vision: data.information[0].mission_vision,
      support_form: data.information[0].forms_of_support,
      address: data.address,
      email: data.email,
      phone: data.contact_number,
      logo: data.logo,
      website: data.website,
      category_ong_id: parseInt(data.category, 10),
      schedule: data.attention_schedule[0].schedule,
      projects: data.projects,
      account_numbers: data.account_number,
      social_networks: data.social_networks
    };
  }

  private transformAddress(address: string): any {
    const parts = address.split(',').map(part => part.trim());
    let street = '', district = '', city = '', country = '';

    if (parts.length >= 5) {
      country = parts[parts.length - 1];
      city = parts[parts.length - 2];
      district = parts[parts.length - 3];
      street = parts.slice(0, parts.length - 3).join(', ');
    } else if (parts.length === 4) {
      country = parts[parts.length - 1];
      city = parts[parts.length - 2];
      district = parts[parts.length - 3];
      street = parts[0];
    } else if (parts.length === 3) {
      country = parts[parts.length - 1];
      city = parts[parts.length - 2];
      district = parts[1];
      street = parts[0];
    } else if (parts.length === 2) {
      country = parts[1];
      city = parts[0];
    } else if (parts.length === 1) {
      street = parts[0];
    }

    street = street || 'Desconocido';
    district = district || 'Desconocido';
    city = city || 'Desconocido';
    country = country || 'Desconocido';

    return { street, district, city, country };
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError('Something bad happened; please try again later.');
  }
}
