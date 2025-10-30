import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { PostsService } from '../../service/posts/posts.service';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostInfoUserContentComponent } from '../../components/create-post-info-user-content/create-post-info-user-content.component';
import { CreateInfoPostContentComponent } from '../../components/create-info-post-content/create-info-post-content.component';
import { DialogSuccessfullyPostComponent } from '../../../public/components/dialog-successfully-post/dialog-successfully-post.component';
import {DialogLimitReachedComponent} from "../../components/dialog-limit-reached/dialog-limit-reached.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { DialogErrorComponent } from '../../../public/components/dialog-error/dialog-error.component';

import {AiService} from "../../service/ai/ai.service";
import {ProductSuggestionDto} from "../../../model/ai/product-suggestion.dto";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CreatePostInfoUserContentComponent,
    CreateInfoPostContentComponent,
    MatButton,
    MatProgressSpinnerModule,
    NgIf,

  ],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  @ViewChild(CreatePostInfoUserContentComponent) createPostInfoUserContentComponent!: CreatePostInfoUserContentComponent;
  @ViewChild(CreateInfoPostContentComponent) createInfoPostContentComponent!: CreateInfoPostContentComponent;

  imageDefault = 'https://media.istockphoto.com/id/1472933890/es/vector/no-hay-s%C3%ADmbolo-vectorial-de-imagen-falta-el-icono-disponible-no-hay-galer%C3%ADa-para-este.jpg';
  loading = false;

  aiLoading = false;
  aiSuggestion: ProductSuggestionDto | null = null;

  constructor(
    private productsService: PostsService,
    private dialog: MatDialog,
    private router: Router,
    private aiService: AiService,
  ) {  }

  // Botón: Analizar foto con IA
  onAnalyzeImage(forceOverride = false): void {
    const userId = parseInt(localStorage.getItem('id') || '-1', 10);
    if (!userId || userId < 0) {
      this.dialog.open(DialogErrorComponent, {
        data: { title: 'Sesión inválida', message: 'No se pudo leer el usuario (localStorage.id).' },
        disableClose: true
      });
      return;
    }

    // el hijo debe exponer el file actual
    const file = this.createInfoPostContentComponent?.getSelectedFile?.();
    if (!file) {
      this.dialog.open(DialogErrorComponent, {
        data: { title: 'Imagen requerida', message: 'Primero selecciona una imagen del producto.' },
        disableClose: true
      });
      return;
    }

    this.aiLoading = true;
    this.aiService.suggestFromImage(userId, file).subscribe({
      next: (dto) => {
        this.aiSuggestion = dto ?? null;
        // aplicar al form del hijo (rellena campos vacíos, o fuerza si forceOverride)
        this.createInfoPostContentComponent.applyAiSuggestion(dto, forceOverride);
        this.aiLoading = false;
      },
      error: (err) => {
        this.aiLoading = false;
        const title = err?.status === 403 ? 'La imagen no cumple políticas' : 'No se pudo analizar la imagen';
        const message = (err?.message || 'Inténtalo nuevamente').toString();
        this.dialog.open(DialogErrorComponent, {
          data: { title, message },
          disableClose: true
        });
      }
    });
  }

  onPost(): void {
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
