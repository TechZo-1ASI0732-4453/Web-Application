import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SearchProductsComponent} from "../../components/search-products/search-products.component";
import {ProductsFoundComponent} from "../../components/products-found/products-found.component";
import {JsonPipe} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {PostsService} from "../../service/posts/posts.service";

@Component({
  selector: 'app-filter-products',
  standalone: true,
  imports: [
    SearchProductsComponent,
    ProductsFoundComponent,
    JsonPipe
  ],
  templateUrl: './filter-products.component.html',
  styleUrl: './filter-products.component.css'
})
export class FilterProductsComponent implements OnInit{
  @ViewChild(ProductsFoundComponent) productsFoundComponent!: ProductsFoundComponent;

  categoryName:string = '';

  constructor(private router:ActivatedRoute){
  }

  ngOnInit() {
    this.getProductCategory()
  }

  getProductCategory(){
    this.router.paramMap.subscribe(params=> {
      const urlProductCategory = params.get('products')
      this.categoryName = urlProductCategory ? urlProductCategory.split('&')[1] : ''
    })
    }


  handleFilterProduct(form:any){
    this.productsFoundComponent.filterProducts(form)
  }

  handleFilterByCategory(category_name:string){
    this.productsFoundComponent.filterProductsByCategory(category_name)
  }
}
