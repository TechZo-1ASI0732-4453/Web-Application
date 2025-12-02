import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule} from "@angular/material/icon";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {OffersService} from "../../service/offers/offers.service";
import {ReviewsService} from "../../service/reviews/reviews.service";
import { ReactiveFormsModule} from "@angular/forms";
import {FormsModule} from "@angular/forms";
import {DialogEditPostComponent} from "../../../public/components/dialog-edit-post/dialog-edit-post.component";
import {DialogChatComponent} from "../../../public/components/dialog-chat/dialog-chat.component";
import {ChatService} from "../../service/chat/chat.service";

@Component({
  selector: 'app-complete-exchanges',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    NgForOf,
    NgIf,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    NgClass,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './complete-exchanges.component.html',
  styleUrl: './complete-exchanges.component.css'
})
export class CompleteExchangesComponent implements OnInit{
  @Output() checkEmpty = new EventEmitter<boolean>();

  userId: number = Number(localStorage.getItem('id'));
  offers: any[] = [];

  maxRating: number = 5;
  selectedStar:number[]=[];
  maxRatingArr:any=[];
  previousSelection:number[]=[];
  inputs: any[] = [];

  constructor(
    private dialog: MatDialog,
    private dialogReviewPost: MatDialog,
    private offersService:OffersService,
    private reviewService:ReviewsService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.maxRatingArr=Array(this.maxRating).fill(0);
    this.getFinishedOffers();
  }

  getFinishedOffers() {
    if (!this.userId) return;
    this.offersService.getFinishedByUserId(this.userId.toString()).subscribe((data: any[]) => {
      this.offers = data;

      this.offers.forEach((offer) => {
        if(offer.userOwn.id !== this.userId) {
          const temP = offer.productOwn;
          offer.productOwn = offer.productChange;
          offer.productChange = temP;

          const temU = offer.userOwn;
          offer.userOwn = offer.userChange;
          offer.userChange = temU;
        }

        this.reviewService.getReviewByAuthorAndExchange(this.userId.toString(),offer.id)
          .subscribe((res) => {
            offer.reviewExisted = res.existReview;
          });
      });
    });
  }

  HandleMouseEnter(indexRate:number,indexOffer:number){
    this.selectedStar[indexOffer]=indexRate+1;
  }

  HandleMouseLeave(indexOffer:number){
    if(this.previousSelection[indexOffer]!==0) {
      this.selectedStar[indexOffer] = this.previousSelection[indexOffer];
    } else {
      this.selectedStar[indexOffer]=0;
    }
  }

  Rating(indexRate:number,indexOffer:number){
    this.selectedStar[indexOffer]=indexRate+1;
    this.previousSelection[indexOffer]=this.selectedStar[indexOffer];
  }

  sendReview(indexOffer: number, otherId: number, exchangeId: number) {
    if (!this.selectedStar[indexOffer]) {
      alert("Por favor seleccione una puntuación de estrellas");
      return;
    }
    const reviewPayload = {
      message:        this.inputs[indexOffer] || "",
      rating:         this.selectedStar[indexOffer],
      state:          "COMPLETED",
      exchangeId:     exchangeId,
      userAuthorId:   this.userId,
      userReceptorId: otherId
    };

    this.reviewService.postReview(reviewPayload)
      .subscribe(() => {
        this.dialogReviewPost.open(DialogEditPostComponent, { disableClose: true });
      });
  }

  openChat(user: any, exchangeId: number) {
    if (!user) return;

    const conversationId = exchangeId.toString();

    this.chatService
      .openConversation(conversationId, exchangeId.toString())
      .subscribe(() => {
        this.dialog.open(DialogChatComponent, {
          data: {
            name: user.name,
            profilePicture: user.profilePicture,
            myUserId: this.userId,
            peerId: user.id,
            conversationId: conversationId,
            exchangeId: exchangeId
          },
          width: '500px',
          height: '90vh',
          disableClose: true
        });
      });
  }

}
