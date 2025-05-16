import {Component, Input, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {NgForOf} from "@angular/common";
import {OngsService} from "../../service/ongs/ongs.service";

@Component({
  selector: 'app-contact-ong',
  standalone: true,
    imports: [
        MatButton,
        MatCard,
        MatCardContent,
        MatCardHeader,
        MatIcon,
        NgForOf
    ],
  templateUrl: './contact-ong.component.html',
  styleUrl: './contact-ong.component.css'
})
export class ContactOngComponent implements OnInit{
  @Input() ong: any;
  constructor(private ongsService: OngsService) { }

  ngOnInit() {
    this.getCategoryName();
  }

  getCategoryName() {

      this.ongsService.getCategoryNameById(this.ong.categoryOngId)
        .subscribe(categoryName => {
          this.ong.category_name = categoryName;
        });

  }

}
