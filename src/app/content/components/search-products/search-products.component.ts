import {Component, effect, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormGroup, ReactiveFormsModule, FormControl, Validators, FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {CountriesService} from "../../service/countries/countries.service";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import { CommonModule } from '@angular/common';
import {CambiazoStateService} from "../../states/cambiazo-state.service";

@Component({
  selector: 'app-search-products',
  standalone: true,
  imports: [
    MatButton,
    NgForOf,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    JsonPipe,
    MatIcon,
    MatOption,
    NgIf,
    MatSelect,
    FormsModule,
    CommonModule
  ],
  templateUrl: './search-products.component.html',
  styleUrl: './search-products.component.css'
})
export class SearchProductsComponent{

  @Output() categorySearched = new EventEmitter<any>();
  @Output() productSearched = new EventEmitter<any>();

  private readonly stateCambiazo = inject(CambiazoStateService)


  categories:any[] = []
  buttonSelected: string = ''
  countries: any[]= []
  departments: any[]=[]
  districts: any[]=[]


  formProduct = new FormGroup({
    'wordKey': new FormControl(null, Validators.required),
    'countryId': new FormControl(null, Validators.required),
    'departmentId': new FormControl(null, Validators.required),
    'districtId': new FormControl(null, Validators.required),
    'priceMin': new FormControl(null, Validators.required),
    'priceMax': new FormControl(null, Validators.required),
  })

  constructor(private countriesService: CountriesService) {
    effect(() => {
      this.categories = this.stateCambiazo.categoriesProducts()
      this.countries = this.stateCambiazo.location()
    });
  }

  filterProducts(category_name:string){
    this.buttonSelected = category_name
    this.categorySearched.emit(category_name)
  }

  onSubmit(){
    this.productSearched.emit(this.formProduct.value);
  }

  onCountrySelectionChange(){

    this.departments = [];
    this.districts = [];
    this.formProduct.get('departmentId')?.reset();
    this.formProduct.get('districtId')?.reset();

    const selectedCountryId = this.formProduct.value.countryId;
    if (selectedCountryId) {
      const selectedCountry = this.countries.find(c => c.id === selectedCountryId);
      if (selectedCountry) {
        this.departments = selectedCountry.departments || [];
      }
    }

  }
  onCitiesSelectionChange(){
    this.districts = [];
    this.formProduct.get('districtId')?.reset();
    const selectedDepartmentId = this.formProduct.value.departmentId;
    if (selectedDepartmentId) {
      const selectedDepartment = this.departments.find(d => d.id === selectedDepartmentId);
      if (selectedDepartment) {
        this.districts = selectedDepartment.districts || [];
      }
    }
  }

  onClear(){
    this.formProduct.reset()
  }

  validateInput(event:any) {
    if (event.data === '-' || event.data === '+')event.preventDefault();
  }



}
