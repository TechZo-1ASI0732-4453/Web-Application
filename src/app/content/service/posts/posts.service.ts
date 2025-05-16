import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  shareReplay,
  switchMap
} from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Products } from '../../model/products/products.model';
import {FlatProduct} from "../../model/flat-product/flat-product";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private readonly baseUrl = environment.baseUrl;

  private districtCache = new Map<number, Observable<any>>();
  private departmentCache = new Map<number, Observable<any>>();
  private countryCache = new Map<number, Observable<any>>();
  private categoryCache = new Map<string, Observable<any>>();

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Products[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/v2/products`).pipe(
      switchMap(products =>
        forkJoin(
          products.map(product => {
            const districtId = product.location?.districtId ?? product.districtId;

            if (!districtId) {
              return of(
                this.transformProduct({
                  product,
                  country: null,
                  department: null,
                  district: null
                })
              );
            }

            const district$ =
              this.districtCache.get(districtId) ||
              this.http
                .get<any>(`${this.baseUrl}/api/v2/districts/${districtId}`)
                .pipe(shareReplay(1));
            this.districtCache.set(districtId, district$);

            return district$.pipe(
              switchMap(district => {
                const department$ =
                  this.departmentCache.get(district.departmentId) ||
                  this.http
                    .get<any>(
                      `${this.baseUrl}/api/v2/departments/${district.departmentId}`
                    )
                    .pipe(shareReplay(1));
                this.departmentCache.set(district.departmentId, department$);

                return department$.pipe(
                  switchMap(department => {
                    const country$ =
                      this.countryCache.get(department.countryId) ||
                      this.http
                        .get<any>(
                          `${this.baseUrl}/api/v2/countries/${department.countryId}`
                        )
                        .pipe(shareReplay(1));
                    this.countryCache.set(department.countryId, country$);

                    return forkJoin({
                      product: of(product),
                      country: country$,
                      department: of(department),
                      district: of(district)
                    });
                  }),
                  map(details => this.transformProduct(details))
                );
              })
            );
          })
        )
      )
    );
  }

  getNewProductsF(){
    return this.http.get<any[]>(`${this.baseUrl}/api/v2/products`)
  }

  postProduct(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/v2/products`, data);
  }

  deleteProduct(id: number) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.delete(`${this.baseUrl}/api/v2/products/delete/${id}`, { headers });
  }

  putProduct(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/api/v2/products/edit/${id}`, {
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
    });
  }

  getProductsFlatByUserId(userId: number): Observable<Products[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/api/v2/products/user/${userId}`)
      .pipe(
        map(products =>
          products.map(p => new Products(
            p.id.toString(),
            p.user.id.toString(),
            p.productCategory.id.toString(),
            p.name,
            p.description,
            p.desiredObject,
            p.price,
            [p.image],
            p.boost,
            p.available,
            {
              country:    p.location.countryName,
              department: p.location.departmentName,
              district:   p.location.districtName
            }
          ))
        )
      );
  }

  getNewProductsByUserId(userId: number): Observable<FlatProduct[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/api/v2/products/user/${userId}`)
      .pipe(
        map(products =>
          products.map(p => ({
            id: p.id.toString(),
            userId: p.user.id.toString(),
            categoryId: p.productCategory.id.toString(),
            category: p.productCategory.name,
            name: p.name,
            description: p.description,
            desiredObject: p.desiredObject,
            price: p.price,
            images: [p.image],
            boost: p.boost,
            available: p.available,
            location: {
              country: p.location.countryName,
              department: p.location.departmentName,
              district: p.location.districtName
            }
          }))
        )
      );
  }

  getProductsFlat(): Observable<FlatProduct[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/v2/products`).pipe(
      map(list =>
        list.map(p => ({
          id: p.id.toString(),
          userId: p.user.id.toString(),
          categoryId: p.productCategory.id.toString(),
          category: p.productCategory.name,
          name: p.name,
          description: p.description,
          desiredObject: p.desiredObject,
          price: p.price,
          images: [p.image],
          boost: p.boost,
          available: p.available,
          location: {
            country: p.location.countryName,
            department: p.location.departmentName,
            district: p.location.districtName
          }
        }))
      )
    );
  }

  getProductById(id: string): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/api/v2/products/${id}`)
      .pipe(map(this.transformProduct2));
  }

  getProductsByUserId(userId: number): Observable<Products[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/api/v2/products/user/${userId}`)
      .pipe(
        switchMap(products =>
          forkJoin(
            products.map(product => {
              const districtId = product.location?.districtId ?? product.districtId;

              if (!districtId) {
                return of(
                  this.transformProduct({
                    product,
                    country: null,
                    department: null,
                    district: null
                  })
                );
              }

              const district$ =
                this.districtCache.get(districtId) ||
                this.http
                  .get<any>(`${this.baseUrl}/api/v2/districts/${districtId}`)
                  .pipe(shareReplay(1));
              this.districtCache.set(districtId, district$);

              return district$.pipe(
                switchMap(district => {
                  const department$ =
                    this.departmentCache.get(district.departmentId) ||
                    this.http
                      .get<any>(
                        `${this.baseUrl}/api/v2/departments/${district.departmentId}`
                      )
                      .pipe(shareReplay(1));
                  this.departmentCache.set(district.departmentId, department$);

                  return department$.pipe(
                    switchMap(department => {
                      const country$ =
                        this.countryCache.get(department.countryId) ||
                        this.http
                          .get<any>(
                            `${this.baseUrl}/api/v2/countries/${department.countryId}`
                          )
                          .pipe(shareReplay(1));
                      this.countryCache.set(department.countryId, country$);

                      return forkJoin({
                        product: of(product),
                        country: country$,
                        department: of(department),
                        district: of(district)
                      });
                    }),
                    map(details => this.transformProduct(details))
                  );
                })
              );
            })
          )
        )
      );
  }
  getCategoriesProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/v2/product-categories`)

  }

  postCategoryProduct(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/api/v2/product-categories`,
      data
    );
  }

  deleteCategoryProduct(id: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/api/v2/product-categories/${id}`
    );
  }

  putCategoryProduct(id: string, data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/api/v2/product-categories/${id}`,
      data
    );
  }

  getCategoryProductById(id: string): Observable<any> {
    if (this.categoryCache.has(id)) return this.categoryCache.get(id)!;

    const request = this.http
      .get<any>(`${this.baseUrl}/api/v2/product-categories/${id}`)
      .pipe(shareReplay(1));

    this.categoryCache.set(id, request);
    return request;
  }

  private transformProduct(details: {
    product: any;
    country: any;
    department: any;
    district: any;
  }): any {
    const product = details.product;

    return {
      id: product.id?.toString() ?? null,

      user_id:      product.user?.id?.toString() ?? null,
      category_id:  product.productCategory?.id?.toString() ?? null,

      product_name: product.name,
      description:  product.description,
      change_for:   product.desiredObject,
      price:        product.price,

      images: [product.image],
      boost:  product.boost,
      available: product.available,

      location: {
        country:    details.country?.name    ?? product.location?.countryName    ?? null,
        department: details.department?.name ?? product.location?.departmentName ?? null,
        district:   details.district?.name   ?? product.location?.districtName   ?? null
      },

      category: product.productCategory?.name ?? null
    };
  }

  private transformProduct2(product: any): any {
    return {
      id:           product.id?.toString() ?? null,
      user_id:      product.user?.id?.toString() ?? null,
      category_id:  product.productCategory?.id?.toString() ?? null,
      product_name: product.name,
      description:  product.description,
      change_for:   product.desiredObject,
      price:        product.price,
      image:        product.image,
      images:       product.image ? [product.image] : [],
      boost:        product.boost,
      available:    product.available,
      location:     product.location,
      category:     product.productCategory?.name ?? null
    };
  }

  getCountryById(id: number): Observable<any> {
    return id
      ? this.http.get<any>(`${this.baseUrl}/api/v2/countries/${id}`)
      : of(null);
  }

  getDepartmentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/v2/departments/${id}`);
  }

  getDistrictById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/v2/districts/${id}`);
  }

  getDistrictId(districtName: string): Observable<number> {
    return this.http.get<any[]>(`${this.baseUrl}/api/v2/districts`).pipe(
      map(
        districts =>
          districts.find(d => d.name === districtName)?.id ?? -1
      ),
      catchError(() => of(-1))
    );
  }
}
