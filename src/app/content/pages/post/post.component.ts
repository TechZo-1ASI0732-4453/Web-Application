import { Component, ViewChild, effect, signal, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { PostsService } from '../../service/posts/posts.service';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostInfoUserContentComponent } from '../../components/create-post-info-user-content/create-post-info-user-content.component';
import { CreateInfoPostContentComponent } from '../../components/create-info-post-content/create-info-post-content.component';
import { DialogSuccessfullyPostComponent } from '../../../public/components/dialog-successfully-post/dialog-successfully-post.component';
import { DialogLimitReachedComponent } from '../../components/dialog-limit-reached/dialog-limit-reached.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgClass, NgIf } from '@angular/common';
import { DialogErrorComponent } from '../../../public/components/dialog-error/dialog-error.component';

import { AiService } from '../../service/ai/ai.service';
import { ProductSuggestionDto } from '../../../model/ai/product-suggestion.dto';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CreatePostInfoUserContentComponent,
    CreateInfoPostContentComponent,
    MatButton,
    MatProgressSpinnerModule,
    NgIf,
    NgClass,
  ],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnDestroy {
  @ViewChild(CreatePostInfoUserContentComponent) createPostInfoUserContentComponent!: CreatePostInfoUserContentComponent;
  @ViewChild(CreateInfoPostContentComponent) createInfoPostContentComponent!: CreateInfoPostContentComponent;

  imageDefault = 'https://media.istockphoto.com/id/1472933890/es/vector/no-hay-s%C3%ADmbolo-vectorial-de-imagen-falta-el-icono-disponible-no-hay-galer%C3%ADa-para-este.jpg';
  loading = false;

  // IA
  aiLoading = false;
  aiSuggestion: ProductSuggestionDto | null = null;

  // Señal con el hijo (archivo seleccionado)
  selectedFile = signal<File | null>(null);

  // Bloqueo
  isBanned = false;
  banRemainingMs = 0;
  private banTimer?: any;
  private lastAnalyzedKey = '';

  // Persistencia
  private static readonly BAN_KEY_PREFIX = 'cambiazo.banUntil.';

  constructor(
    private productsService: PostsService,
    private dialog: MatDialog,
    private router: Router,
    private aiService: AiService,
  ) {
    // Llama a IA automáticamente cuando cambia el archivo
    effect(() => {
      const f = this.selectedFile();
      if (!f || this.isBanned) return;

      const key = `${f.name}|${f.size}|${f.lastModified}`;
      if (key === this.lastAnalyzedKey) return;
      this.lastAnalyzedKey = key;

      this.callAi(f);
    });
  }

  ngOnInit(): void {
    this.restoreBanFromStorage();
  }

  ngOnDestroy(): void {
    if (this.banTimer) clearInterval(this.banTimer);
  }

  // ==== Persistencia ban ====
  private storageKey(userId: number): string {
    return `${PostComponent.BAN_KEY_PREFIX}${userId}`;
  }

  private restoreBanFromStorage(): void {
    const userId = parseInt(localStorage.getItem('id') || '-1', 10);
    if (!userId || userId < 0) return;

    const raw = localStorage.getItem(this.storageKey(userId));
    if (!raw) return;

    if (raw === 'PERMA') {
      this.isBanned = true;
      this.banRemainingMs = 0;
      return;
    }

    const until = parseInt(raw, 10);
    if (Number.isFinite(until) && until > Date.now()) {
      this.startBanUntil(until);
    } else {
      localStorage.removeItem(this.storageKey(userId));
      this.isBanned = false;
      this.banRemainingMs = 0;
    }
  }

  private startPermanentBan(): void {
    this.isBanned = true;
    this.banRemainingMs = 0;

    const userId = parseInt(localStorage.getItem('id') || '-1', 10);
    if (userId && userId > 0) {
      localStorage.setItem(this.storageKey(userId), 'PERMA');
    }
  }

  private startBanCountdownMinutes(totalMinutes: number): void {
    if (!totalMinutes || totalMinutes <= 0) {
      this.startPermanentBan();
      return;
    }
    const end = Date.now() + totalMinutes * 60_000;
    this.startBanUntil(end);

    const userId = parseInt(localStorage.getItem('id') || '-1', 10);
    if (userId && userId > 0) {
      localStorage.setItem(this.storageKey(userId), String(end));
    }
  }

  private startBanCountdownMs(ms: number): void {
    if (!ms || ms <= 0) {
      this.startPermanentBan();
      return;
    }
    const end = Date.now() + ms;
    this.startBanUntil(end);

    const userId = parseInt(localStorage.getItem('id') || '-1', 10);
    if (userId && userId > 0) {
      localStorage.setItem(this.storageKey(userId), String(end));
    }
  }

  private startBanUntil(untilMs: number): void {
    this.isBanned = true;
    this.banRemainingMs = Math.max(0, untilMs - Date.now());

    if (this.banTimer) clearInterval(this.banTimer);
    this.banTimer = setInterval(() => {
      this.banRemainingMs = Math.max(0, untilMs - Date.now());
      if (this.banRemainingMs === 0) {
        this.isBanned = false;
        clearInterval(this.banTimer);

        const userId = parseInt(localStorage.getItem('id') || '-1', 10);
        if (userId && userId > 0) {
          localStorage.removeItem(this.storageKey(userId));
        }
      }
    }, 1000);
  }

  // ==== IA ====
  private callAi(file: File): void {
    const userId = parseInt(localStorage.getItem('id') || '-1', 10);
    if (!userId || userId < 0) {
      this.dialog.open(DialogErrorComponent, {
        data: { title: 'Sesión inválida', message: 'No se pudo leer el usuario (localStorage.id).' },
        disableClose: true
      });
      return;
    }

    this.aiLoading = true;
    this.aiService.suggestFromImage(userId, file).subscribe({
      next: (dto) => {
        this.aiLoading = false;
        this.aiSuggestion = dto ?? null;
        // Rellena sin forzar
        this.createInfoPostContentComponent.applyAiSuggestion(dto, false);
      },
      error: (err) => {
        this.aiLoading = false;

        // 1) Intento directo: duration numérico ya en ms/seg/min
        let durationMs = this.extractNumericDurationMs(err)
          ?? this.extractNumericDurationMs(err?.error);

        // 2) Si no hay numérico, intento parsear string/ISO o usar minutos
        if (!durationMs) {
          durationMs = this.parseDurationToMs(
            err?.duration ?? err?.error?.duration ?? err?.message
          );
        }
        if (!durationMs) {
          const minutes = Number(
            err?.banDurationMinutes ??
            err?.error?.banDurationMinutes ??
            err?.minutes ?? 0
          );
          if (minutes > 0) durationMs = minutes * 60_000;
        }

        if (err?.status === 403) {
          if (durationMs && durationMs > 0) this.startBanCountdownMs(durationMs);
          else this.startPermanentBan();

          this.dialog.open(DialogErrorComponent, {
            data: {
              title: 'Imagen no permitida',
              message: (err?.message || 'La imagen viola la política').toString()
            },
            disableClose: true
          });
          return;
        }

        const title = err?.status === 401 ? 'No autorizado' : 'No se pudo analizar la imagen';
        const message = (err?.message || 'Inténtalo nuevamente').toString();
        this.dialog.open(DialogErrorComponent, { data: { title, message }, disableClose: true });
      }
    });
  }

  /** Si viene duration numérico, lo normaliza a ms.
   * Reglas:
   * - >= 60_000 → se asume milisegundos
   * - >= 1_000 y < 60_000 → se asume segundos
   * - < 1_000 y > 0 → se asume minutos
   */
  private extractNumericDurationMs(src: any | undefined): number | null {
    if (!src) return null;
    const d = src.duration;
    if (typeof d !== 'number' || !Number.isFinite(d) || d <= 0) return null;
    if (d >= 60_000) return d;                // ya está en ms
    if (d >= 1_000)  return d * 1_000;        // segundos → ms
    return d * 60_000;                        // minutos → ms
  }

  // ==== Parseo de duration → ms ====
  private parseDurationToMs(raw: any): number {
    if (raw == null) return 0;

    // numérico: si parece ms/seg/min
    if (typeof raw === 'number' && Number.isFinite(raw)) {
      if (raw >= 60_000) return raw;          // ms
      if (raw >= 1_000)  return raw * 1_000;  // segundos → ms
      return raw * 60_000;                    // minutos → ms
    }

    if (typeof raw === 'string') {
      const s = raw.trim();
      if (!s) return 0;
      if (/sin restric/i.test(s)) return 0;

      // ISO-8601: PT#H#M#S
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
      if (Number.isFinite(asNum)) {
        if (asNum >= 60_000) return asNum;          // ms
        if (asNum >= 1_000)  return asNum * 1_000;  // segundos
        return asNum * 60_000;                      // minutos
      }

      // dentro del mensaje algo como "Sanción: 2h 5m"
      const inline = /(\d+)\s*h(?:[^0-9]+(\d+)\s*m)?/i.exec(s) || /(\d+)\s*m/i.exec(s);
      if (inline) {
        const h = Number(inline[1] || 0);
        const m = Number((inline as any)[2] || (inline.length === 2 ? inline[1] : 0) || 0);
        return ((h * 60 + m) * 60) * 1000;
      }
    }

    // objeto { hours/minutes/seconds }
    if (typeof raw === 'object') {
      const h = Number((raw as any).hours || 0);
      const m = Number((raw as any).minutes || 0);
      const sec = Number((raw as any).seconds || 0);
      if (h || m || sec) return ((h * 60 + m) * 60 + sec) * 1000;
    }

    return 0;
  }

  // ==== Util ====
  formatHms(ms: number): string {
    const total = Math.floor((ms || 0) / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  // ==== Publicar ====
  onPost(): void {
    if (this.isBanned) return;

    const infoProduct = this.createInfoPostContentComponent.onSubmit();
    const contactProduct = this.createPostInfoUserContentComponent.onSubmit();
    if (!infoProduct || !contactProduct) return;

    this.loading = true;

    this.createInfoPostContentComponent.uploadImage()
      .then(images => {
        const newProduct = {
          userId: parseInt(localStorage.getItem('id') || '-1'),
          description: infoProduct.description,
          name: infoProduct.product_name,
          desiredObject: infoProduct.change_for,
          productCategoryId: infoProduct.category_id,
          image: images.length ? images[0] : this.imageDefault,
          price: infoProduct.price,
          boost: contactProduct.boost,
          districtId: contactProduct.districtId,
          available: true,
        };
        this.productsService.postProduct(newProduct).subscribe({
          next: () => {
            this.loading = false;
            const ref = this.dialog.open(DialogSuccessfullyPostComponent);
            ref.afterClosed().subscribe(() => this.router.navigateByUrl('/home'));
          }
        });
      })
      .catch(err => {
        this.loading = false;
        if (err.status === 400) {
          this.dialog.open(DialogLimitReachedComponent, { disableClose: true });
        } else {
          this.dialog.open(DialogErrorComponent, {
            data: {
              title: 'Ocurrió un error',
              message: 'Error al publicar el producto. Por favor, inténtalo de nuevo más tarde.'
            },
            disableClose: true
          });
          console.error('POST /products →', err);
        }
      });
  }
}
