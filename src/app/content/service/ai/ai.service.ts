// src/app/service/ai/ai.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {ProductSuggestionDto} from "../../../model/ai/product-suggestion.dto";
import {environment} from "../../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class AiService {
  private base = ((environment as any).baseUrl || (environment as any).apiUrl || '').replace(/\/+$/, '');

  constructor(private http: HttpClient) {}

  suggestFromImage(userId: number, file: File): Observable<ProductSuggestionDto> {
    const form = new FormData();
    form.append('file', file, file.name || 'image');

    const params = new HttpParams().set('userId', String(userId));

    // 👇 CLAVE: enviar cookies/sesión como lo hacen tus otros servicios
    return this.http
      .post<ProductSuggestionDto>(`${this.base}/exchanges/ai/suggest`, form, {
        params,
        withCredentials: true, // <— esto faltaba en tu implementación
      })
      .pipe(
        catchError((e: HttpErrorResponse) => {
          if (e.status === 401) {
            return throwError(() => ({ status: 401, message: 'No autorizado. Verifica tu token/sesión.' }));
          }
          if (e.status === 403 && e.error) {
            try {
              const json = typeof e.error === 'object' ? e.error : JSON.parse(String(e.error || '{}'));
              const minutes = Number(json?.banDurationMinutes ?? 0);
              const h = Math.trunc(minutes / 60);
              const m = Math.trunc(minutes % 60);
              const duration = minutes > 0 ? `${h}h ${m}m` : 'sin restricción de tiempo';
              const msg = [
                json?.violationType ? `Tipo: ${json.violationType}` : null,
                json?.message ? `Mensaje: ${json.message}` : null,
                `Sanción: ${duration}`,
                json?.policyReference ? `Política: ${json.policyReference}` : null,
              ].filter(Boolean).join('\n');
              return throwError(() => ({ status: 403, message: msg }));
            } catch { /* ignore */ }
          }
          const message = (typeof e.error === 'string' && e.error) || e.message || `Error HTTP ${e.status}`;
          return throwError(() => ({ status: e.status, message }));
        })
      );
  }
}
