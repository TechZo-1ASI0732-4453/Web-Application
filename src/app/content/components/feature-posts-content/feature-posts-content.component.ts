import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../service/posts/posts.service';
import { MatCardModule } from '@angular/material/card';
import { NgForOf, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {FlatProduct} from "../../model/flat-product/flat-product";

@Component({
  selector: 'app-feature-posts-content',
  standalone: true,
  imports: [MatCardModule, NgForOf, NgIf, MatIcon, RouterLink],
  templateUrl: './feature-posts-content.component.html',
  styleUrls: ['./feature-posts-content.component.css']
})
export class FeaturePostsContentComponent implements OnInit {
  items: FlatProduct[] = [];
  loading = true;

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    this.postsService.getProductsFlat().subscribe(products => {
      this.items = products.filter(p => p.boost && p.available);
      this.loading = false;
    });
  }
}
