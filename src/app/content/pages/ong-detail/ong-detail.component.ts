import {Component, OnInit, Output} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {NgForOf} from "@angular/common";
import {Ongs} from "../../model/ongs/ongs.model";
import {OngsService} from "../../service/ongs/ongs.service";
import {MatIcon} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {DetailOngComponent} from "../../components/detail-ong/detail-ong.component";
import {ContactComponent} from "../contact/contact.component";
import {ContactOngComponent} from "../../components/contact-ong/contact-ong.component";

@Component({
  selector: 'app-ong-detail',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    MatIcon,
    MatCardModule,
    MatButton,
    DetailOngComponent,
    ContactComponent,
    ContactOngComponent,
  ],
  templateUrl: './ong-detail.component.html',
  styleUrl: './ong-detail.component.css'
})
export class OngDetailComponent implements OnInit{
  @Output() ong_obj: any;
  ong: any;
  categories: any;

  constructor(private ongService:OngsService,private route: ActivatedRoute){}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const ong = params.get('ong')/*ong have this value: mathias&Id=1*/
      const id = ong ? ong.split('&Id=')[1] : ''/*id have this value: 1*/
      this.getOng(id);
    });
  }

  getOng(id: string){
    this.ongService.getOngById(id).subscribe((res:any)=>{
      this.ong = new Ongs(
        res.name,
        res.type,
        res.information,
        res.projects,
        res.account_number,
        res.address,
        res.category,
        res.email,
        res.contact_number,
        res.attention_schedule,
        res.logo,
        res.website,
        res.social_networks,
        res.id
      )
      this.ong_obj = this.ong;

      this.ongService.getCategoriesOngs().subscribe((categories:any)=>{
        this.categories = categories;
        this.ong.category_name = this.categories.find((category:any)=>category.id === this.ong.category).name;
      }
    )})
  }

}
