import {inject, Injectable, signal, Signal, WritableSignal} from '@angular/core';
import {District} from "../model/district/district";
import {Department} from "../model/department/department";
import {Country} from "../model/country/country";
import {CategoriesObjects} from "../model/categories-objects/categories-objects.model";
import {CountriesService} from "../service/countries/countries.service";
import {take} from "rxjs";
import {PostsService} from "../service/posts/posts.service";
import {CountryDto} from "../model/location/location";

@Injectable({
  providedIn: 'root'
})

export class CambiazoStateService {


  serviceLocation: CountriesService = inject(CountriesService);
  serviceProductCategories: PostsService = inject(PostsService);

  districts: WritableSignal<District[]> = signal([]);
  //departments: WritableSignal<Department[]> = signal([]);
  //countries: WritableSignal<Country[]> = signal([]);
  categoriesProducts: WritableSignal<CategoriesObjects[]> = signal([]);
  location: WritableSignal<CountryDto[]> = signal([]);

  constructor() {
    //this.serviceLocation.getCountries().pipe(take(1)).subscribe((countries: Country[]) => this.countries.set(countries))
    //this.serviceLocation.getAllDepartments().pipe(take(1)).subscribe((departments: Department[]) => this.departments.set(departments))
    this.serviceLocation.getAllDistricts().pipe(take(1)).subscribe((districts: District[]) => this.districts.set(districts))
    this.serviceProductCategories.getCategoriesProducts().pipe(take(1)).subscribe((categories: CategoriesObjects[]) => this.categoriesProducts.set(categories))
    this.serviceLocation.getLocation().pipe(take(1)).subscribe((countries:CountryDto[]) => this.location.set(countries));
  }

}
