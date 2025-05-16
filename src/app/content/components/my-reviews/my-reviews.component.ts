import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from '../../service/users/users.service';
import { ReviewsService } from '../../service/reviews/reviews.service';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Reviews } from '../../model/reviews/reviews.model';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-my-reviews',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    NgForOf,
    NgIf,
    NgClass,
    MatProgressBar,
  ],
  templateUrl: './my-reviews.component.html',
  styleUrl: './my-reviews.component.css',
})
export class MyReviewsComponent implements OnInit {
  user: any = {};
  reviews: any = [];
  myReviews: any = [];
  averageScore: number = 0;
  totalReviews: number = 0;
  ratings: { score: number; percentage: number }[] = [];
  constructor(
    private userService: UsersService,
    private reviewService: ReviewsService
  ) {}

  ngOnInit() {
    this.getMyReviews();
  }

  getMyReviews() {
    const userId = localStorage.getItem('id');
    if (!userId) return;

    this.reviewService.getReviewsByReceptor(userId).subscribe((res: any[]) => {
      this.myReviews = res;
      this.totalReviews = res.length;


      for (let i = 5; i >= 1; i--) {
        const count = this.myReviews.filter((r: any) => r.rating === i).length;
        const percentage = (count / this.totalReviews) * 100;
        this.ratings.push({ score: i, percentage });
      }

      this.averageScore =
        this.totalReviews > 0
          ? this.myReviews.reduce((acc: number, r: any) => acc + r.rating, 0) /
            this.totalReviews
          : 0;

    });

  }
  getStarIcons(score: number): { icon: string; filled: boolean }[] {
    const starIcons: { icon: string; filled: boolean }[] = [];
    for (let i = 0; i < 5; i++) {
      if (i < score) {
        starIcons.push({ icon: 'star', filled: true });
      } else {
        starIcons.push({ icon: 'star', filled: false });
      }
    }
    return starIcons;
  }


  getStarRating(score: number): { icon: string }[] {
    const starRating: { icon: string }[] = [];
    const fullStars = Math.floor(score);
    const decimalPart = score - fullStars;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starRating.push({ icon: 'star' });
      } else if (i === fullStars && decimalPart >= 0.01 && decimalPart < 0.99) {
        starRating.push({ icon: 'star_half' });
      } else {
        starRating.push({ icon: 'stars' });
      }
    }
    return starRating;
  }
}
