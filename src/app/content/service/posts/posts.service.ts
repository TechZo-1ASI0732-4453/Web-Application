import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {catchError, forkJoin, Observable, of, shareReplay, switchMap, tap} from "rxjs";
import {Products} from "../../model/products/products.model";
import {map} from "rxjs/operators";
import {FormControl, ɵValue} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  /******************* Products **************************/
  private districtCache = new Map<number, Observable<any>>();
  private departmentCache = new Map<number, Observable<any>>();
  private countryCache = new Map<number, Observable<any>>();

  getProducs(): Observable<Products[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/v2/products`).pipe(
      switchMap(products => {
        const productObservables = products.map(product => {
          const district$ = this.districtCache.get(product.districtId) || this.http.get<any>(`${this.baseUrl}/api/v2/districts/${product.districtId}`).pipe(shareReplay(1));
          this.districtCache.set(product.districtId, district$);

          return district$.pipe(
            switchMap(district => {
              const department$ = this.departmentCache.get(district.departmentId) || this.http.get<any>(`${this.baseUrl}/api/v2/departments/${district.departmentId}`).pipe(shareReplay(1));
              this.departmentCache.set(district.departmentId, department$);

              return department$.pipe(
                switchMap(department => {
                  const country$ = this.countryCache.get(department.countryId) || this.http.get<any>(`${this.baseUrl}/api/v2/countries/${department.countryId}`).pipe(shareReplay(1));
                  this.countryCache.set(department.countryId, country$);

                  return forkJoin({
                    product: of(product),
                    country: country$,
                    department: of(department),
                    district: of(district)
                  });
                })
              );
            }),
            map(details => this.transformProduct(details))
          );
        });
        return forkJoin(productObservables);
      })
    );
  }


  postProduct(data: any): Observable<any> {
    const district = data.location.district;
    if (district === null || district === undefined) {
      throw new Error('District is null or undefined');
    }
    return forkJoin({
      districtId: this.getDistrictId(district),
    }).pipe(
      switchMap(ids => {
        const backendData = {
          name: data.product_name,
          description: data.description,
          desiredObject: data.change_for,
          price: data.price,
          image: data.images[0],
          boost: data.boost,
          available: true,
          productCategoryId: data.category_id,
          userId: data.user_id,
          districtId: ids.districtId
        };
        return this.http.post<any>(`${this.baseUrl}/api/v2/products`, backendData);
      })
    );
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/v2/products/delete/${id}`);
  }

  putProduct(id: number, data: any): Observable<any> {
    const backendData = {
      name: data.name,
      description: data.description,
      desiredObject: data.desiredObject,
      price: data.price,
      image: data.image,
      boost: data.boost,
      available: data.available,
      productCategoryId: data.productCategoryId,
      userId: data.userId,
      districtId: data.districtId
    };
    console.log(backendData)
    return this.http.put<any>(`${this.baseUrl}/api/v2/products/edit/${id}`, backendData);
  }

  getProductById(id: string): Observable<Products> {
    return this.http.get<any>(`${this.baseUrl}/api/v2/products/${id}`).pipe(
      switchMap(product => {
        const district$ = this.districtCache.get(product.districtId) || this.http.get<any>(`${this.baseUrl}/api/v2/districts/${product.districtId}`).pipe(
          shareReplay(1)
        );
        this.districtCache.set(product.districtId, district$);

        return district$.pipe(
          switchMap(district => {
            const department$ = this.departmentCache.get(district.departmentId) || this.http.get<any>(`${this.baseUrl}/api/v2/departments/${district.departmentId}`).pipe(
              shareReplay(1)
            );
            this.departmentCache.set(district.departmentId, department$);

            return department$.pipe(
              switchMap(department => {
                const country$ = this.countryCache.get(department.countryId) || this.http.get<any>(`${this.baseUrl}/api/v2/countries/${department.countryId}`).pipe(
                  shareReplay(1)
                );
                this.countryCache.set(department.countryId, country$);

                return forkJoin({
                  product: of(product),
                  country: country$,
                  department: of(department),
                  district: of(district)
                });
              }),
              map(details => {
                return {
                  ...details.product,
                  location: {
                    country: details.country.name,
                    department: details.department.name,
                    district: details.district.name
                  }
                };
              }),
              map(this.transformProduct2)
            );
          })
        );
      })
    );
  }


  getProducts2(): Observable<Products[]> {
    return this.getProducs();
  }

  getProductsByUserId(userId: number): Observable<Products[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/v2/products/user/${userId}`).pipe(
      switchMap(products => {
        const productObservables = products.map(product => {
          const district$ = this.districtCache.get(product.districtId) || this.http.get<any>(`${this.baseUrl}/api/v2/districts/${product.districtId}`).pipe(shareReplay(1));
          this.districtCache.set(product.districtId, district$);

          return district$.pipe(
            switchMap(district => {
              const department$ = this.departmentCache.get(district.departmentId) || this.http.get<any>(`${this.baseUrl}/api/v2/departments/${district.departmentId}`).pipe(shareReplay(1));
              this.departmentCache.set(district.departmentId, department$);

              return department$.pipe(
                switchMap(department => {
                  const country$ = this.countryCache.get(department.countryId) || this.http.get<any>(`${this.baseUrl}/api/v2/countries/${department.countryId}`).pipe(shareReplay(1));
                  this.countryCache.set(department.countryId, country$);

                  return forkJoin({
                    product: of(product),
                    country: country$,
                    department: of(department),
                    district: of(district)
                  });
                })
              );
            }),
            map(details => this.transformProduct(details))
          );
        });
        return forkJoin(productObservables);
      })
    );
  }

  /******************* Products Categories **********************/
  getCategoriesProducts(): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/api/v2/product-category`).pipe(
      map(categories => {
        if (categories) {
          return categories.map(category => ({
            ...category,
            name: category.name
          }));
        } else {
          return [];
        }
      }),
      catchError(error => {
        return of([]);
      })
    );
  }

  postCategoryProduct(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/v2/product-category`, data);
  }

  deleteCategoryProduct(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/v2/product-category/${id}`);
  }

  putCategoryProduct(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/v2/product-category/${id}`, data);
  }

  private categoryCache = new Map<string, Observable<any>>();

  getCategoryProductById(id: string): Observable<any> {
    if (this.categoryCache.has(id)) {
      return this.categoryCache.get(id)!;
    } else {
      const request = this.http.get<any>(`${this.baseUrl}/api/v2/product-category/${id}`).pipe(
        shareReplay(1)
      );
      this.categoryCache.set(id, request);
      return request;
    }
  }

  /******************* Helper Methods **********************/
  private transformProduct(details: any): any {
    if (!details || !details.product) {
      return;
    }

    const product = details.product;
    const location = {
      country: details.country ? details.country.name : null,
      department: details.department ? details.department.name : null,
      district: details.district ? details.district.name : null
    };
    const transformedProduct = {
      id: product.id ? product.id.toString() : null,
      user_id: product.userId ? product.userId.toString() : null,
      category_id: product.productCategoryId ? product.productCategoryId.toString() : null,
      product_name: product.name,
      description: product.description,
      change_for: product.desiredObject,
      price: product.price,
      images: [product.image],
      boost: product.boost,
      available: product.available,
      location: location,
      category: product.category
    };
    return transformedProduct;
  }

  private transformToNewStructure(product: any): any {
    return {
      user_id: parseInt(product.user_id, 10),
      product_category_id: parseInt(product.category_id, 10),
      name: product.product_name,
      description: product.description,
      desired_object: product.change_for,
      price: product.price,
      image: product.images[0],
      boost: product.boost,
      available: product.available,
      district_id: this.getDistrictId(product.location)
    };
  }

  private transformProduct2(product: any): any {
    if (!product) {
      return;
    }
    const transformedProduct = {
      id: product.id ? product.id.toString() : null,
      user_id: product.userId ? product.userId.toString() : null,
      category_id: product.productCategoryId ? product.productCategoryId.toString() : null,
      product_name: product.name,
      description: product.description,
      change_for: product.desiredObject,
      price: product.price,
      images: [product.image],
      boost: product.boost,
      available: product.available,
      location: product.location,
      category: product.category
    };
    console.log(transformedProduct)
    return transformedProduct;
  }

  /******************* Location Endpoints **********************/
  getCountryById(id: number): Observable<any> {
    if (id) {
      return this.http.get<any>(`${this.baseUrl}/api/v2/countries/${id}`);
    } else {
      return of(null);
    }
  }

  getDepartmentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/v2/departments/${id}`);
  }

  getDistrictById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/v2/districts/${id}`);
  }

  getDistrictId(districtName: string): Observable<number> {
    return this.http.get<any[]>(`${this.baseUrl}/api/v2/districts`).pipe(
      map(districts => districts.find(district => district.name === districtName)?.id || -1),
      catchError(() => of(-1))
    );
  }

  private getDepartmentId(departmentName: string): Observable<number> {
    return this.http.get<any[]>(`${this.baseUrl}/api/v2/departments`).pipe(
      map(departments => departments.find(department => department.name === departmentName)?.id || -1),
      catchError(() => of(-1))
    );
  }

  private getCountryId(countryName: string): Observable<number> {
    return this.http.get<any[]>(`${this.baseUrl}/api/v2/countries`).pipe(
      map(countries => countries.find(country => country.name === countryName)?.id || -1),
      catchError(() => of(-1))
    );
  }

}


