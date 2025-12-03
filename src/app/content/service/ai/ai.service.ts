import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductSuggestionDto } from "../../../model/ai/product-suggestion.dto";
import { environment } from "../../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class AiService {
  private base = ((environment as any).baseUrl || (environment as any).apiUrl || '').replace(/\/+$/, '');

  constructor(private http: HttpClient) {}

  suggestFromImage(userId: number, file: File): Observable<ProductSuggestionDto> {
    const form = new FormData();
    form.append('file', file, file.name || 'image');

    const params = new HttpParams().set('userId', String(userId));

    return this.http
      .post<ProductSuggestionDto>(`${this.base}/api/v2/exchanges/ai/suggest`, form, {
        params,
        withCredentials: true,
      })
      .pipe(
        catchError((e: HttpErrorResponse) => {
          if (e.status === 401) {
            return throwError(() => ({ status: 401, message: 'No autorizado. Verifica tu token/sesión.' }));
          }

          if (e.status === 403) {
            // Normalizamos el body para extraer duration
            let json: any = {};
            try {
              json = typeof e.error === 'object' ? e.error : JSON.parse(String(e.error || '{}'));
            } catch { /* ignore */ }

            // 1) duration preferente (puede venir en ms o en formato texto/ISO)
            let durationMs = normalizeDurationToMs(json?.duration);

            // 2) fallback: minutos → ms
            if (!durationMs) {
              const minutes = Number(json?.banDurationMinutes ?? 0);
              durationMs = minutes > 0 ? minutes * 60_000 : 0;
            }

            // Mensaje informativo (opcional)
            const minutesForText = Math.round(durationMs / 60_000);
            const h = Math.trunc(minutesForText / 60);
            const m = Math.trunc(minutesForText % 60);
            const durationText = durationMs > 0 ? `${h}h ${m}m` : 'sin restricción de tiempo';

            const msg = [
              json?.violationType ? `Tipo: ${json.violationType}` : null,
              json?.message ? `Mensaje: ${json.message}` : null,
              `Sanción: ${durationText}`,
              json?.policyReference ? `Política: ${json.policyReference}` : null,
            ].filter(Boolean).join('\n');

            // 👈 DEVUELVE la duración para que el componente arranque el contador
            return throwError(() => ({
              status: 403,
              message: msg,
              duration: durationMs,             // ← en milisegundos
              minutes: minutesForText || undefined,
            }));
          }

          const message = (typeof e.error === 'string' && e.error) || e.message || `Error HTTP ${e.status}`;
          return throwError(() => ({ status: e.status, message }));
        })
      );
  }
}

/** Convierte distintos formatos de duración a milisegundos. */
function normalizeDurationToMs(raw: any): number {
  if (raw == null) return 0;

  // numérico: si es grande lo tomamos como ms; si no, como minutos
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return raw >= 60_000 ? raw : raw * 60_000;
  }

  if (typeof raw === 'string') {
    const s = raw.trim();
    if (!s) return 0;
    if (/sin restric/i.test(s)) return 0;

    // ISO-8601 tipo PT#H#M#S
    const iso = /^P(T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)$/i.exec(s);
    if (iso) {
      const h = Number(iso[2] || 0);
      const m = Number(iso[3] || 0);
      const sec = Number(iso[4] || 0);
      return ((h * 60 + m) * 60 + sec) * 1000;
    }

    // hh:mm:ss o mm:ss
    const hms = /^(?:(\d{1,2}):)?(\d{1,2}):(\d{1,2})$/.exec(s);
    if (hms) {
      const h = Number(hms[1] || 0);
      const m = Number(hms[2] || 0);
      const sec = Number(hms[3] || 0);
      return ((h * 60 + m) * 60 + sec) * 1000;
    }

    // "2h 15m" / "45m" / "2h" / “1h 5m 30s”
    const rx = /(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?\s*(?:(\d+)\s*s)?/i.exec(s);
    if (rx && (rx[1] || rx[2] || rx[3])) {
      const h = Number(rx[1] || 0);
      const m = Number(rx[2] || 0);
      const sec = Number(rx[3] || 0);
      return ((h * 60 + m) * 60 + sec) * 1000;
    }

    // número en texto → minutos
    const asNum = Number(s);
    if (Number.isFinite(asNum)) return asNum * 60_000;
  }

  // objeto { hours/minutes/seconds }
  if (typeof raw === 'object') {
    const h = Number(raw.hours || 0);
    const m = Number(raw.minutes || 0);
    const sec = Number(raw.seconds || 0);
    if (h || m || sec) return ((h * 60 + m) * 60 + sec) * 1000;
  }

  return 0;
}
