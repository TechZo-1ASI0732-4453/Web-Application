import {Component, OnInit} from '@angular/core';
import {MatFormField} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {NgForOf, NgIf} from "@angular/common";
import {OngsService} from "../../service/ongs/ongs.service";
import {Ongs} from "../../model/ongs/ongs.model";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-search-ongs',
  standalone: true,
  imports: [
    MatFormField,
    MatIcon,
    MatInputModule,
    MatCardModule,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './search-ongs.component.html',
  styleUrl: './search-ongs.component.css'
})
export class SearchOngsComponent implements OnInit{
  items:Ongs[]=[]
  ongSearched:Ongs[]=[]
  isLoading: boolean = true;

  constructor(private ongsService:OngsService) {
  }

  ngOnInit() {
    this.ongsService.getOngs().subscribe(
      (res: any) => {
        this.items = res;
        this.ongSearched = this.items;
        this.isLoading = false;
      },
      error => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }

  searchOngs(event: any) {
    const ongsSearched = event.target.value.toLowerCase();
    this.ongSearched = this.items.filter((ongs: Ongs) => {
      const ongsNameNormalized = ongs.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return ongsNameNormalized.includes(ongsSearched) || ongsSearched === '';
    });
  }

  filterOng(data:any){
    this.ongSearched = this.items.filter((ong:Ongs)=>{
    const ongCountryNormalized = ong.address.country.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const ongDepartmentNormalized = ong.address.city.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const ongDistrictNormalized = ong.address.district.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const ongStreetNormalized = ong.address.street.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

      return (
        ongCountryNormalized.includes(data.address) ||
        ongDepartmentNormalized.includes(data.address)||
        ongDistrictNormalized.includes(data.address) ||
        ongStreetNormalized.includes(data.address) ||
        data.address == ''
      )&&(
        data.categories.includes(ong.category) || !data.categories.length)
    })

  }


}
