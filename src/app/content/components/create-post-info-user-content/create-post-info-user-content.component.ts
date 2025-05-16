import {Component, effect, inject, Input, OnInit} from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../../service/users/users.service';
import { Users } from '../../model/users/users.model';
import {CambiazoStateService} from "../../states/cambiazo-state.service";
import {Country} from "../../model/country/country";
import {Department} from "../../model/department/department";
import {District} from "../../model/district/district";

@Component({
  selector: 'app-create-post-info-user-content',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    NgForOf,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './create-post-info-user-content.component.html',
  styleUrls: ['./create-post-info-user-content.component.css']
})
export class CreatePostInfoUserContentComponent implements OnInit {
  @Input() boost = false;
  @Input() country: any | null = null;
  @Input() department: any | null = null;
  @Input() district: any | null = null;

  private readonly stateCambiazo = inject(CambiazoStateService);

  countries: any[] = [];
  departments: any[] = [];
  districts: any[] = [];

  user: Users | null = null;

  formProduct = new FormGroup({
    boost:      new FormControl(false),
    countryId:    new FormControl<number | null>(null, Validators.required),
    departmentId: new FormControl<number | null>(null, Validators.required),
    districtId:   new FormControl<number | null>(null, Validators.required)
  });

  acceptPolicy = new FormControl(false, Validators.requiredTrue);

  constructor( private usersService: UsersService) {
    effect(() => {
      this.countries = this.stateCambiazo.location();
      this.loadCountries();
    });
  }

  ngOnInit(): void {
    this.formProduct.get('boost')?.setValue(this.boost);
    this.loadUser();
  }

  onSubmit(): any {
    this.formProduct.markAllAsTouched();
    this.acceptPolicy.markAllAsTouched();

    return this.formProduct.valid && this.acceptPolicy.valid
      ? this.formProduct.value
      : null;
  }

  private loadCountries(): void {
      if (this.country) {
        this.formProduct.get('countryId')?.setValue(this.country.id);
        this.onCountryChange();
        this.formProduct.get('departmentId')?.setValue(this.department.id);
        this.onDepartmentChange();
        this.formProduct.get('districtId')?.setValue(this.district.id);
      }
  }

  onCountryChange(): void {
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

  onDepartmentChange(): void {
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

  private loadUser(): void {
    const id = Number(localStorage.getItem('id'));
    this.usersService.getUserById(id).subscribe(u => {
      this.user = new Users(
        u.id, u.name, u.username, u.phoneNumber,
        u.password, u.membership, u.profilePicture,
        u.isActive, u.isGoogleAccount, u.roles, []
      );
    });
  }
}
