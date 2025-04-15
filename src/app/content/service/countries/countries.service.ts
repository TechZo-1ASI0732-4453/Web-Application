import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable, forkJoin, shareReplay} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  private getCountry(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/v2/countries/${id}`);
  }

  private getDepartmentsByCountry(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/v2/departments/country/${id}`).pipe(
      shareReplay(1)
    );
  }

  private getDistrictsByDepartment(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/v2/districts/departments/${id}`).pipe(
      shareReplay(1)
    );
  }

  getCountries(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/v2/countries`).pipe(
      shareReplay(1)
    );
  }

  getLocation(): Observable<any> {
    return this.getCountries().pipe(
      switchMap(countries => {
        const countryObservables = countries.map((country:any) => {
          return this.getDepartmentsByCountry(country.id).pipe(
            switchMap(departments => {
              const departmentObservables = departments.map((department:any) => {
                return this.getDistrictsByDepartment(department.id).pipe(
                  map(districts => ({
                    name: department.name,
                    cities: districts.map((district:any) => district.name)
                  }))
                );
              });
              return forkJoin(departmentObservables).pipe(
                map(departments => ({
                  country: country.name,
                  departments: departments
                }))
              );
            })
          );
        });
        return forkJoin(countryObservables);
      })
    );
  }
}
