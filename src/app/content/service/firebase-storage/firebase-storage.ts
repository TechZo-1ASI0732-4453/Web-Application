import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseStorageService {
  constructor(private storage: AngularFireStorage) {}

  uploadProductImage(file: File, productId: string): { progress$: Observable<number | undefined>; url$: Observable<string> } {
    const path = `products/${productId}/${file.name}`;
    const task = this.storage.upload(path, file);
    const progress$ = task.percentageChanges();
    const url$ = new Observable<string>(obs => {
      task.snapshotChanges().pipe(
        finalize(() => this.storage.ref(path).getDownloadURL().subscribe(url => { obs.next(url); obs.complete(); }))
      ).subscribe();
    });
    return { progress$, url$ };
  }

  uploadProfileImage(file: File, userId: string): { progress$: Observable<number | undefined>; url$: Observable<string> } {
    const path = `profiles/${userId}/${file.name}`;
    const task = this.storage.upload(path, file);
    const progress$ = task.percentageChanges();
    const url$ = new Observable<string>(obs => {
      task.snapshotChanges().pipe(
        finalize(() => this.storage.ref(path).getDownloadURL().subscribe(url => { obs.next(url); obs.complete(); }))
      ).subscribe();
    });
    return { progress$, url$ };
  }

  getDownloadURL(path: string): Observable<string> {
    return this.storage.ref(path).getDownloadURL();
  }

  deleteFile(path: string) {
    return this.storage.ref(path).delete();
  }
}
