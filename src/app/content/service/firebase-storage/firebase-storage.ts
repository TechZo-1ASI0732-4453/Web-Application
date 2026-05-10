import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseStorageService {
  private readonly baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  uploadProductImage(file: File, productId: string): { progress$: Observable<number | undefined>; url$: Observable<string> } {
    return this.upload(file, `${this.baseUrl}/api/v2/files/products/${encodeURIComponent(productId)}`);
  }

  uploadProfileImage(file: File, userId: string): { progress$: Observable<number | undefined>; url$: Observable<string> } {
    return this.upload(file, `${this.baseUrl}/api/v2/files/profiles/${encodeURIComponent(userId)}`);
  }

  private upload(file: File, endpoint: string): { progress$: Observable<number | undefined>; url$: Observable<string> } {
    const form = new FormData();
    form.append('file', file, file.name);

    const progress$ = new Subject<number | undefined>();
    const url$ = new ReplaySubject<string>(1);

    const req = new HttpRequest('POST', endpoint, form, { reportProgress: true });

    this.http.request(req).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          progress$.next(Math.round((event.loaded / event.total) * 100));
        } else if (event.type === HttpEventType.Response) {
          const url = event.body?.url;
          if (typeof url !== 'string') {
            url$.error(new Error('Upload response missing "url" field'));
            return;
          }
          url$.next(url);
          url$.complete();
          progress$.complete();
        }
      },
      error: err => {
        progress$.error(err);
        url$.error(err);
      }
    });

    return { progress$: progress$.asObservable(), url$: url$.asObservable() };
  }
}
