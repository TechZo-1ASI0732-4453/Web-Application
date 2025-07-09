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

  constructor(
    private productsService: PostsService,
    private dialog: MatDialog,
    private router: Router
  ) {  }

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