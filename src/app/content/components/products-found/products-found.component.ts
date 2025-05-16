import {Component, effect, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardFooter,
  MatCardHeader, MatCardImage,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem} from "@angular/material/menu";
import {NgForOf, NgIf} from "@angular/common";
import {Products} from "../../model/products/products.model";
import {PostsService} from "../../service/posts/posts.service";
import {RouterLink} from "@angular/router";
import {switchMap} from "rxjs";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
import {CambiazoStateService} from "../../states/cambiazo-state.service";

@Component({
  selector: 'app-products-found',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardFooter,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    NgForOf,
    NgIf,
    MatCardImage,
    RouterLink
  ],
  templateUrl: './products-found.component.html',
  styleUrl: './products-found.component.css'
})
export class ProductsFoundComponent implements OnInit{
  @Input() categoryIdSearched:string= '';

  allProducts:any[]=[]
  productsFiltered:any[]=[]
  categories:any[] = []
  loading = true;

  constructor(private postService:PostsService) {

  }

  ngOnInit() {
    this.getAllProducts()
  }

  filterProductsByCategory(category_name:string){
    // Asigna el nombre de la categoría a categoryIdSearched
    this.categoryIdSearched = category_name;
    // Filtra los productos por nombre de categoría
    this.productsFiltered = this.allProducts.filter((item: Products) => item.getCategory === this.categoryIdSearched);
  }

  filterProducts(product:any) {
    this.loading = true;
    this.productsFiltered = this.allProducts.filter((item: Products) =>
      item.category === this.categoryIdSearched &&
      (product.wordKey ? item.product_name.toLowerCase().includes(product.wordKey.toLowerCase()): true)&&
      (product.countryId ? item.location.countryId == product.countryId : true) &&
      (product.departmentId ? item.location.departmentId == product.departmentId: true) &&
      (product.districtId ? item.location.districtId == product.districtId: true) &&
      (item.price >= (product.priceMin ? product.priceMin: 0) &&
        item.price <= (product.priceMax ? product.priceMax:Infinity)));
    this.loading = false;
  }


  getAllProducts() {
    this.postService.getNewProductsF().subscribe((res: any) => {
      res.forEach((product: any) => {
        const p =  new Products(
          String(product.id),
          product.user.id,
          String(product.productCategory.id),
          product.name,
          product.description,
          product.desiredObject,
          product.price,
          [product.image],
          product.boost,
          product.available,
          product.location)

        p.setCategory = product.productCategory.name
        this.allProducts.push(p)
      })

        this.productsFiltered = this.allProducts.filter((item: Products) => item.getCategory === this.categoryIdSearched)
        this.loading = false;
    })
  }


}
