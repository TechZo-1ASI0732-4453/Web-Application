import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { PostsService } from '../../service/posts/posts.service';
import { CreatePostInfoUserContentComponent } from '../../components/create-post-info-user-content/create-post-info-user-content.component';
import { CreateInfoPostContentComponent } from '../../components/create-info-post-content/create-info-post-content.component';
import { DialogSuccessfulProductEditionComponent } from '../../../public/components/dialog-successful-product-edition/dialog-successful-product-edition.component';
import {Country} from "../../model/country/country";
import {Department} from "../../model/department/department";
import {District} from "../../model/district/district";

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [
    RouterLink,
    MatIcon,
    MatCardModule,
    MatButton,
    CreatePostInfoUserContentComponent,
    CreateInfoPostContentComponent,
    NgIf
  ],
  templateUrl: './edit-post.component.html',
  styleUrls: ['../post/post.component.css','./edit-post.component.css']
})
export class EditPostComponent implements OnInit {
  @ViewChild(CreatePostInfoUserContentComponent) createPostInfoUserContentComponent!: CreatePostInfoUserContentComponent;
  @ViewChild(CreateInfoPostContentComponent) createInfoPostContentComponent!: CreateInfoPostContentComponent;

  post: any;
  district: any
  department: any
  country: any

  constructor(
    private dialog: MatDialog,
    private productsService: PostsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const raw = params.get('postId') || '';
      const id = raw.split('&Id=')[1] || '';
      this.getPost(id);
    });
  }

  getPost(id: string): void {
    this.productsService.getProductById(id).subscribe((res: any) => {
      this.post = res;
      this.country = { id:res.location.countryId, name: res.location.countryName};
      this.department = {id:res.location.departmentId, name: res.location.departmentName};
      this.district = {id:res.location.districtId, name: res.location.districtName};
    });
  }

  onPost(): void {
    const infoProduct   = this.createInfoPostContentComponent.onSubmit();
    const contactProduct = this.createPostInfoUserContentComponent.onSubmit();
    if (!infoProduct || !contactProduct) return;

    this.createInfoPostContentComponent.uploadImage().then(uploaded => {
      const imageToSend = uploaded.length ? uploaded[0] : this.post.images[0];

        const newProduct = {
          name:               infoProduct.product_name,
          description:        infoProduct.description,
          desiredObject:      infoProduct.change_for,
          price:              infoProduct.price,
          image:              imageToSend,
          boost:              contactProduct.boost,
          available:          true,
          productCategoryId:  Number(infoProduct.category_id),
          userId:             Number(localStorage.getItem('id')),
          districtId: contactProduct.districtId,
        };

        this.productsService
          .putProduct(Number(this.post.id), newProduct)
          .subscribe(() => this.successEdition());
      });
  }
  successEdition(): void {
    const ref = this.dialog.open(DialogSuccessfulProductEditionComponent, { disableClose: true });
    ref.afterClosed().subscribe(() => this.router.navigateByUrl('/profile/my-posts'));
  }

  protected readonly parseInt = parseInt;
}
