import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../service/users/users.service';
import { ReviewsService } from '../../service/reviews/reviews.service';
import { OffersService } from '../../service/offers/offers.service';
import { PostsService } from '../../service/posts/posts.service';
import { Users } from '../../model/users/users.model';
import { Reviews } from '../../model/reviews/reviews.model';
import { Offers } from '../../model/offers/offers.model';
import { Products } from '../../model/products/products.model';
import { Clipboard } from '@angular/cdk/clipboard';
import {MatIcon} from "@angular/material/icon";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-publisher-profile',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    NgIf,
    RouterLink,
    NgForOf,
    MatIcon
  ],
  templateUrl: './publisher-profile.component.html',
  styleUrls: ['./publisher-profile.component.css']
})
export class PublisherProfileComponent implements OnInit {
  user: Users | null = null;
  userProducts: Products[] = [];
  reviews: Reviews[] = [];
  myReviews: Reviews[] = [];

  averageScore: number = 0;
  totalReviews: number = 0;
  ratings: { score: number, percentage: number }[] = [];
  acceptedOffersCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private reviewsService: ReviewsService,
    private offersService: OffersService,
    private postsService: PostsService,
    private clipboard: Clipboard
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.usersService.getUserById(Number(userId)).subscribe((data: Users) => {
        this.user = data;
        this.loadUserProducts(userId);
        this.loadReviews(userId);
        this.loadAcceptedOffersCount(userId);
      });
    }
  }

  loadReviews(userId: string): void {
    this.reviewsService.getReviewsByReceptor(userId).subscribe((res: any) => {
      this.reviews = res.map((review: any) => {
        const r = new Reviews(
        review.id,
        review.message,
        review.rating,
        review.userReceptor.id,
        review.userAuthor.id,)
        r.setGiveUserName = review.userAuthor.name;
        review.userReceptor.id === parseInt(userId) ? this.myReviews.push(r) : null;
        return r;
      });

      this.totalReviews = this.myReviews.length;
      this.calculateRatings();
      this.calculateAverageScore();
    });
  }


  loadAcceptedOffersCount(userId: string): void {
    this.offersService.getFinishedByUserId(userId).subscribe((offers: any) => {
      this.acceptedOffersCount = offers.length;
    });
  }

  loadUserProducts(userId: string): void {
    this.postsService.getProductsByUserId(parseInt(userId)).subscribe(products =>{
      this.userProducts = products.filter(product => product.available)
    }
  );
  }

  calculateRatings(): void {
    this.ratings = [];
    for (let i = 5; i >= 1; i--) {
      const count = this.myReviews.filter((review: any) => review.score === i).length;
      const percentage = (count / this.totalReviews) * 100;
      this.ratings.push({ score: i, percentage });
    }
  }

  calculateAverageScore(): void {
    this.averageScore = this.totalReviews > 0
      ? this.myReviews.reduce((acc: any, review: any) => acc + review.score, 0) / this.totalReviews
      : 0;
  }

  getStarRating(score: number): { icon: string }[] {
    const starRating: { icon: string }[] = [];
    const fullStars = Math.floor(score);
    const decimalPart = score - fullStars;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starRating.push({ icon: 'star' });
      } else if (i === fullStars && decimalPart >= 0.5) {
        starRating.push({ icon: 'star_half' });
      } else {
        starRating.push({ icon: 'star_border' });
      }
    }
    return starRating;
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
      title: "Enlace de perfil copiado"
    });
  }

  copyProfileLink(): void {
    const url = window.location.href;
    this.clipboard.copy(url);
    this.message()
  }
}
