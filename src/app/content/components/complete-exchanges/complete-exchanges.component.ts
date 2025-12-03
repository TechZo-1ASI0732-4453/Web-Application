import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {OffersService} from '../../service/offers/offers.service';
import {ReviewsService} from '../../service/reviews/reviews.service';
import {ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from '@angular/forms';
import {DialogEditPostComponent} from '../../../public/components/dialog-edit-post/dialog-edit-post.component';
import {DialogChatComponent} from '../../../public/components/dialog-chat/dialog-chat.component';
import {ChatService} from '../../service/chat/chat.service';

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
export class CompleteExchangesComponent implements OnInit {
  @Output() checkEmpty = new EventEmitter<boolean>();

  userId: number = Number(localStorage.getItem('id'));

  offers: any[] = [];
  offersReversed: any[] = [];

  maxRating: number = 5;
  selectedStar: number[] = [];
  maxRatingArr: any[] = [];
  previousSelection: number[] = [];
  inputs: string[] = [];

  constructor(
    private dialog: MatDialog,
    private dialogReviewPost: MatDialog,
    private offersService: OffersService,
    private reviewService: ReviewsService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.maxRatingArr = Array(this.maxRating).fill(0);
    this.getFinishedOffers();
  }

  getFinishedOffers() {
    if (!this.userId) return;

    this.offersService
      .getFinishedByUserId(this.userId.toString())
      .subscribe((data: any[]) => {
        this.offers = data;

        this.offers.forEach((offer) => {
          // Normalizar para que siempre se vea desde la perspectiva del user actual
          if (offer.userOwn.id !== this.userId) {
            const temP = offer.productOwn;
            offer.productOwn = offer.productChange;
            offer.productChange = temP;

            const temU = offer.userOwn;
            offer.userOwn = offer.userChange;
            offer.userChange = temU;
          }

          this.reviewService
            .getReviewByAuthorAndExchange(this.userId.toString(), offer.id)
            .subscribe((res) => {
              offer.reviewExisted = res.existReview;
            });
        });

        // IMPORTANTE: crear un nuevo array invertido (no usar reverse() en el template)
        this.offersReversed = [...this.offers].reverse();

        // Inicializar arrays paralelos según la cantidad de ofertas
        this.selectedStar = new Array(this.offersReversed.length).fill(0);
        this.previousSelection = new Array(this.offersReversed.length).fill(0);
        this.inputs = new Array(this.offersReversed.length).fill('');
      });
  }

  HandleMouseEnter(indexRate: number, indexOffer: number) {
    this.selectedStar[indexOffer] = indexRate + 1;
  }

  HandleMouseLeave(indexOffer: number) {
    if (this.previousSelection[indexOffer]) {
      this.selectedStar[indexOffer] = this.previousSelection[indexOffer];
    } else {
      this.selectedStar[indexOffer] = 0;
    }
  }

  Rating(indexRate: number, indexOffer: number) {
    this.selectedStar[indexOffer] = indexRate + 1;
    this.previousSelection[indexOffer] = this.selectedStar[indexOffer];
  }

  sendReview(indexOffer: number, otherId: number, exchangeId: number) {
    if (!this.selectedStar[indexOffer]) {
      alert('Por favor seleccione una puntuación de estrellas');
      return;
    }

    const reviewPayload = {
      message: this.inputs[indexOffer] || '',
      rating: this.selectedStar[indexOffer],
      state: 'COMPLETED',
      exchangeId: exchangeId,
      userAuthorId: this.userId,
      userReceptorId: otherId
    };

    this.reviewService.postReview(reviewPayload).subscribe(() => {
      // opcional: marcar como bloqueado en UI inmediatamente
      const offer = this.offersReversed[indexOffer];
      if (offer) {
        offer.reviewExisted = true;
      }

      this.dialogReviewPost.open(DialogEditPostComponent, {disableClose: true});
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

  trackByOffer(index: number, item: any) {
    return item.id ?? index;
  }
}
