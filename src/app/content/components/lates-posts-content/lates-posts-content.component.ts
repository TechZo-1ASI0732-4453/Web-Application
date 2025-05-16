import { Component, OnInit } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { FeaturePostsContentComponent } from "../feature-posts-content/feature-posts-content.component";
import { PostsService } from "../../service/posts/posts.service";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";
import { MatFormField } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { RouterLink } from "@angular/router";
import { CategoriesObjects } from "../../model/categories-objects/categories-objects.model";
import {FlatProduct} from "../../model/flat-product/flat-product";

@Component({
  selector: 'app-lates-posts-content',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    FeaturePostsContentComponent,
    MatIcon,
    MatButton,
    MatFormField,
    MatInput,
    RouterLink
  ],
  templateUrl: './lates-posts-content.component.html',
  styleUrls: ['./lates-posts-content.component.css']
})
export class LatesPostsContentComponent implements OnInit {
  allProducts: FlatProduct[] = [];
  items: FlatProduct[] = [];
  categories: CategoriesObjects[] = [];
  loading = true;
  showCount = 10;

  constructor(private postService: PostsService) {}

  ngOnInit() {
    this.postService.getCategoriesProducts().subscribe(cats => {
      this.categories = cats;
    });
    this.postService.getProductsFlat().subscribe(products => {
      this.allProducts = products;
      this.applyFilters();
      this.loading = false;
    });
  }

  applyFilters(search: string = '') {
    const term = search.trim().toLowerCase()
    this.items = this.allProducts
      .filter(p => p.available)
      .filter(p =>
        term === '' ||
        p.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(term)
      )
  }

  searchProduct(event: Event) {
    this.applyFilters((event.target as HTMLInputElement).value)
    this.showCount = 10
  }

  loadMore() {
    this.showCount += 10
  }
}
