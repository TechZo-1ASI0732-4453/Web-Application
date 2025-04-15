import {Component, OnInit} from '@angular/core';
import {
  MatCard,
  MatCardAvatar,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardTitle
} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {JsonPipe, NgForOf, NgOptimizedImage, NgStyle} from "@angular/common";
import {OffersService} from "../../service/offers/offers.service";
import {PostsService} from "../../service/posts/posts.service";
import {UsersService} from "../../service/users/users.service";
import {Offers} from "../../model/offers/offers.model";
import {Products} from "../../model/products/products.model";
import {DialogDeniedOfferComponent} from "../../../public/components/dialog-denied-offer/dialog-denied-offer.component";
import {MatDialog} from "@angular/material/dialog";
import {
  DialogSuccessfulExchangeComponent
} from "../../../public/components/dialog-successful-exchange/dialog-successful-exchange.component";
import {of} from "rxjs";

@Component({
  selector: 'app-user-get-offers',
  standalone: true,
  imports: [
    MatCard,
    MatCardAvatar,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    NgForOf,
    NgStyle,
    MatCardFooter,
    NgOptimizedImage,
    JsonPipe
  ],
  templateUrl: './user-get-offers.component.html',
  styleUrl: './user-get-offers.component.css'
})
export class UserGetOffersComponent implements OnInit {

  offers: Offers[] = [];

  constructor(
    private offersService: OffersService,
    private postsService: PostsService,
    private usersService: UsersService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getAllOffers();
  }

  getAllOffers() {
    const userId = localStorage.getItem('id');
    if(userId === null) return;
    this.offersService.getAllOffersByUserChangeId(userId).subscribe((data: any) => {
      data.forEach((offer: any) => {
        if(offer.status === 'Pendiente')
          this.offers.push(new Offers(
              offer.id.toString(),
              offer.productOwnId.toString(),
              offer.productChangeId.toString(),
              offer.status
            )
          )
      });

      this.offers.map((offer: any) => {
        this.postsService.getProductById(offer.id_product_offers).subscribe((resPost: any) => {
          offer.setProductOffers = resPost;

          this.usersService.getUserById(Number(offer.product_offers.user_id)).subscribe((resUser: any) => {
            offer.setUserOffers = resUser;
            return offer
          });

        })
      });

      this.offers.map((offer: any) => {
        this.postsService.getProductById(offer.id_product_get).subscribe((resPost: any) => {

          offer.setProductGet = resPost;
        });

      });

    });
  }

  setStatusAccepted(offerId: string) {
    this.offersService.updateOfferStatus(offerId, 'Aceptado').subscribe(() => {
      const offer = this.offers.find((offer: Offers) => offer.id === offerId);

      if (offer) {
        this.offers = this.offers.filter((offer: Offers) => offer.id !== offerId);
        this.dialog.open(DialogSuccessfulExchangeComponent, {
          data: {
            name: offer.user_offer.name,
            profilePicture: offer.user_offer.profilePicture,
            phone: offer.user_offer.phone,
            username: offer.user_offer.username
          },
          disableClose: true
        });
      }
    });
  }

  setStatusDenied(offerId: string) {
    const dialogRef = this.dialog.open(DialogDeniedOfferComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.offersService.updateOfferStatus(offerId, 'Denegado').subscribe(() => {
          this.offers = this.offers.filter((offer: Offers) => offer.id !== offerId);
        });
      }
    });
  }

  protected readonly Offers = Offers;
}


