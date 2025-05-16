import { Component, OnInit } from '@angular/core';
import {UsersService} from "../../service/users/users.service";
import {MatTabsModule} from '@angular/material/tabs';
import {HeaderProfileComponent} from "../../components/header-profile/header-profile.component";
import {MyPostsComponent} from "../../components/my-posts/my-posts.component";
import {MyReviewsComponent} from "../../components/my-reviews/my-reviews.component";
import {MyFavoritesComponent} from "../../components/my-favorites/my-favorites.component";
import {UserOffersComponent} from "../../components/user-offers/user-offers.component";
import { RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-own-profile',
  standalone: true,
  imports: [
    HeaderProfileComponent,
    MatTabsModule,
    MyPostsComponent,
    MyReviewsComponent,
    MyFavoritesComponent,
    UserOffersComponent,
    RouterLink,
    RouterOutlet,
    NgIf,
    RouterLinkActive
  ],
  templateUrl: './own-profile.component.html',
  styleUrl: './own-profile.component.css'
})
export class OwnProfileComponent{


}
