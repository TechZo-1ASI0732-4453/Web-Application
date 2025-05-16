import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import {Observable, map, catchError, throwError, mergeMap, of} from "rxjs";
import { Users } from "../../model/users/users.model";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseUrl = environment.baseUrl;
  loggedIn = false;
  validEmail = false;
  verificationCode: string = '';

  setVerificationCode(code: string): void {
    this.verificationCode = code;
  }

  verifyCode(code: string): boolean {
    return this.verificationCode === code;
  }

  get isLogged() { return this.loggedIn; }
  set isLogged(val: boolean) { this.loggedIn = val; }

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/v2/authentication/sign-in`, data).pipe(
      map((res: any) => {
        localStorage.setItem('token', res.token)
        localStorage.setItem('id', res.id)
        return res
      }),
      catchError(err => {
        if (err.status === 404) return of('user')
        if (err.status === 401) return of('password')
        return this.handleError(err)
      })
    )
  }

  getUserByUsername(username: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/v2/users/username/${username}`);
  }

  verifyEmail(data: any): Observable<boolean> {
    return this.http.get(`${this.baseUrl}/api/v2/authentication/sign-in`).pipe(
      map((res: any) => {
        const user_obj = res.find((user: any) => data.username === user.email);
        if (user_obj) {
          localStorage.setItem('id-temporal', user_obj.id.toString());
          this.validEmail = true;
        } else {
          console.log('User not found');
          this.validEmail = false;
        }
        return this.validEmail;
      }),
      catchError(this.handleError)
    );
  }

  getUsers(): Observable<Users[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/v2/users`).pipe(
      map(users => users.map(user => this.transformToUserModel(user))),
      catchError(this.handleError)
    );
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/v2/authentication/sign-up`, data).pipe(
      catchError(this.handleError)
    );
  }

  addFavoriteProduct(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/v2/favorite-products`, data).pipe(
      catchError(this.handleError)
    );
  }


  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/v2/users/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  putUser(id: any, data: any): Observable<any> {
    const transformedData = this.transformToNewStructure(data);

    return this.http.put(`${this.baseUrl}/api/v2/users/edit/profile/${id}`, transformedData).pipe(
      catchError(this.handleError)
    );
  }

  getUserById(id: number): Observable<Users> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );

    return this.http
      .get<any>(`${this.baseUrl}/api/v2/users/${id}`, { headers })
      .pipe(map(u => this.transformToUserModel(u)));
  }

  changePassword(id: number, newPassword: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/v2/users/edit/${id}`, newPassword).pipe(
      catchError(this.handleError)
    );
  }

  changeMembership(userId: number, membership: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/v2/users/edit/membership/${userId}`, {membershipId: membership}).pipe(
      catchError(this.handleError)
    );
  }

  changeProfileImage(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/v2/users/edit/profile/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  getFavoritesProducts(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/v2/favorite-products/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteFavoriteProduct(userId: string,id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/v2/favorite-products/delete/${userId}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  putUserPassword(password: string, username: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/v2/users/edit/password/${username}`,{ newPassword: password }).pipe(
      catchError(this.handleError)
    );
  }
  private transformToUserModel(data: any): Users {
    return new Users(
      data.id,
      data.name,
      data.username,
      data.phoneNumber,
      data.password,
      data.membershipId,
      data.profilePicture,
      data.isActive,
      data.isGoogleAccount,
      data.roles,
      []
    );
  }

  private transformToNewStructure(data: any): any {
    return {
      name: data.name,
      username: data.username,
      phoneNumber: data.phoneNumber,
      password: data.password,
      profilePicture: data.profilePicture, // Ensure the key names match the backend structure
      isActive: data.isActive,
      isGoogleAccount: data.isGoogleAccount,
      roles: data.roles,
      membershipId: data.membershipId
    };
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
