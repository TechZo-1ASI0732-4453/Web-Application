import { Component, Inject, OnInit } from '@angular/core'
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogContent} from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { CommonModule, NgForOf } from '@angular/common'
import { MatCardModule } from '@angular/material/card'
import { UsersService } from '../../../content/service/users/users.service'
import { PostsService } from '../../../content/service/posts/posts.service'
import { OffersService } from '../../../content/service/offers/offers.service'
import { Products } from '../../../content/model/products/products.model'
import { Offers } from '../../../content/model/offers/offers.model'
import { DialogOfferSuccessfulComponent } from '../dialog-offer-successful/dialog-offer-successful.component'

@Component({
  selector: 'app-dialog-select-product',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    NgForOf,
    MatDialogContent
  ],
  templateUrl: './dialog-select-product.component.html',
  styleUrls: ['./dialog-select-product.component.css']
})
export class DialogSelectProductComponent implements OnInit {
  items: Products[] = []
  offers: Offers[] = []
  selectedProduct: Products | null = null

  constructor(
    public dialogRef: MatDialogRef<DialogSelectProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UsersService,
    private postService: PostsService,
    private offersService: OffersService,
    private dialogSuccess: MatDialog
  ) {}

  ngOnInit(): void {
    const uid = localStorage.getItem('id')!
    this.postService.getProductsFlatByUserId(+uid).subscribe(p => (this.items = p))
    this.offersService.getAllOffersByUserOwnId(uid).subscribe(o => (this.offers = o))
  }

  hasOffered(prod: Products): boolean {
    return this.offers.some(o => {
      const ownId =
        o.id_product_offers
        ?? (o as any).productOwnId
        ?? (o as any).productOwn?.id;

      const changeId =
        o.id_product_get
        ?? (o as any).productChangeId
        ?? (o as any).productChange?.id;

      return +ownId === +prod.id && +changeId === +this.data.product_id;
    });
  }

  offer(prod: Products): void {
    if (this.hasOffered(prod)) return;

    this.selectedProduct = prod;

    const newOffer = new Offers(
      '',
      prod.id.toString(),
      this.data.product_id,
      'Pendiente'
    );

    this.offersService.postOffer(newOffer)
      .subscribe(() => this.closeDialog());
  }

  closeDialog(): void {
    this.dialogRef.close()
    this.dialogRef.afterClosed().subscribe(() => {
      if (this.selectedProduct)
        this.dialogSuccess.open(DialogOfferSuccessfulComponent, {
          data: { product_name: this.selectedProduct.product_name, user_name: this.data.user_name }
        })
    })
  }
}
