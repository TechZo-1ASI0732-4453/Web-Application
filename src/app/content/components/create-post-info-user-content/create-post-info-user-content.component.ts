import {Component, Input, OnInit} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatIcon} from "@angular/material/icon";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatCheckbox} from "@angular/material/checkbox";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {CountriesService} from "../../service/countries/countries.service";
import {FormControl, FormControlName, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UsersService} from "../../service/users/users.service";
import {Products} from "../../model/products/products.model";
import {Users} from "../../model/users/users.model";
import {validateForm} from "@emailjs/browser/es/utils/validateForm/validateForm";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-create-post-info-user-content',
  standalone: true,
  imports: [
    MatFormField,
    MatInputModule,
    MatLabel,
    MatOption,
    MatSelect,
    MatIcon,
    MatSlideToggle,
    MatCheckbox,
    NgForOf,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    JsonPipe,
    RouterLink,
  ],
  templateUrl: './create-post-info-user-content.component.html',
  styleUrl: './create-post-info-user-content.component.css'
})

export class CreatePostInfoUserContentComponent implements OnInit {

  @Input() boost = false
  @Input() country = null;
  @Input() department= null;
  @Input() city = null

  countries: any[] = [];
  departments: any[] = [];
  cities: string[] = [];
  user: any;

  formProduct = new FormGroup({
    'boost': new FormControl(false),
    'country': new FormControl(null, Validators.required),
    'departament': new FormControl(null, Validators.required),
    'district': new FormControl(null, Validators.required),
  });
  acceptPolicy = new FormControl(false, Validators.requiredTrue);

  constructor(private countriesService: CountriesService, private usersService: UsersService) { }

  ngOnInit() {
    this.formProduct.get('boost')?.setValue(this.boost)
    this.getAllCountries()
    this.getUser()
  }

  onSubmit() {
    this.formProduct.markAllAsTouched();
    this.acceptPolicy.markAsTouched();

    if (this.formProduct.valid && this.acceptPolicy.valid) {
      return this.formProduct.value;
    } else return null;
  }

  getAllCountries(){
    this.countriesService.getLocation().subscribe((res:any)=>{
      this.countries = res

      if(this.country){
        this.formProduct.get('country')?.setValue(this.country)
        this.onCountrySelectionChange()
        this.formProduct.get('departament')?.setValue(this.department)
        this.onCitiesSelectionChange()
        this.formProduct.get('district')?.setValue(this.city)
      }
    })
  }

  getUser() {
    const userId = Number(localStorage.getItem('id'));
    this.usersService.getUserById(userId).subscribe(
      (data) => {
        this.user = new Users(
          data.id,
          data.name,
          data.username,
          data.phoneNumber,
          data.password,
          data.membership,
          data.profilePicture,
          data.isActive,
          data.isGoogleAccount,
          data.roles,
          []
        );
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  onCountrySelectionChange() {
    this.departments = [];
    this.cities = [];
    this.formProduct.get('departament')?.reset();
    this.formProduct.get('district')?.reset();
    if (this.formProduct.value.country) {
      const selectedCountryObj = this.countries.find(c => c.country === this.formProduct.value.country);
      this.departments = selectedCountryObj ? selectedCountryObj.departments : [];
    }
  }

  onCitiesSelectionChange() {
    this.cities = [];
    this.formProduct.get('district')?.reset();
    if (this.formProduct.value.departament) {
      const selectedDepartmentObj = this.departments.find(c => c.name === this.formProduct.value.departament);
      this.cities = selectedDepartmentObj ? selectedDepartmentObj.cities : [];
    }
  }
}
