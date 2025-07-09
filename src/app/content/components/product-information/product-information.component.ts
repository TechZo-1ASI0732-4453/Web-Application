import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { PostsService } from '../../service/posts/posts.service';
import { UsersService } from '../../service/users/users.service';
import { DialogFavoritesComponent } from '../../../public/components/dialog-favorites/dialog-favorites.component';
import { DialogSelectProductComponent } from '../../../public/components/dialog-select-product/dialog-select-product.component';
import { DialogLoginRegisterComponent } from '../../../public/components/dialog-login-register/dialog-login-register.component';
import { DialogNoProductsComponent } from '../dialog-no-products/dialog-no-products.component';
import { MatIconModule } from '@angular/material/icon';
import { Clipboard } from '@angular/cdk/clipboard';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-information',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    
  ],
  templateUrl: './product-information.component.html',
  styleUrls: ['./product-information.component.css']
})
export class ProductInformationComponent implements OnInit {
  product: any;
  user: any;
  loading = true;
  showOffer = false;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private usersService: UsersService,
    private dialog: MatDialog,
    private clipboard: Clipboard
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.postsService.getProductById(productId).subscribe(p => {
        this.product = p;
        this.loadUser(+p.user_id);
        this.showOffer = +localStorage.getItem('id')! !== +p.user_id;
        this.loading = false;
      });
    }
  }

  copyLink(userId: number) {
    const url = window.location.href;
    this.clipboard.copy(url);
    this.message()
  }

  message() {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: false,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: "Enlace del producto copiado"
      });
    }

  loadCategories(): void {
    this.postsService.getCategoryProductById(this.product.category_id)
      .subscribe((category: any) => {
        this.product.categoryName = category.name;
      });
  }

  loadUser(userId: number): void {
    this.usersService.getUserById(userId)
      .subscribe(user => this.user = user);
  }

  getLoggedInUserId(): number | null {
    const id = localStorage.getItem('id');
    return id ? Number(id) : null;
  }

  addToFavorites(): void {
    const userId = this.getLoggedInUserId();
    if (userId) {
      this.usersService.addFavoriteProduct({
        productId: Number(this.product.id),
        userId
      }).subscribe(() => this.dialog.open(DialogFavoritesComponent));
    } else {
      this.dialog.open(DialogLoginRegisterComponent, { disableClose: true });
    }
  }

  offer(): void {
    const userId = this.getLoggedInUserId();
    if (userId) {
      this.postsService.getProductsFlat().subscribe(products => {
        const userProducts = products.filter(p => Number(p.userId) === userId);
        if (userProducts.length) {
          this.dialog.open(DialogSelectProductComponent, {
            data: {
              product_id: this.product.id,
              user_id: this.user.id,
              product_name: this.product.product_name,
              user_name: this.user.name,
              user_email: this.user.username,
            },
            width: '100rem'
          });
        } else {
          this.dialog.open(DialogNoProductsComponent, { disableClose: true });
        }
      });
    } else {
      this.dialog.open(DialogLoginRegisterComponent, { disableClose: true });
    }
  }

  protected readonly localStorage = localStorage;
}
