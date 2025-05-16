import { Component } from '@angular/core';
import {ProductInformationComponent} from "../../components/product-information/product-information.component";

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    ProductInformationComponent
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {

}
