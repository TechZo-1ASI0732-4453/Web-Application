  import {Component, EventEmitter, OnInit, Output} from '@angular/core';
  import {MatCheckboxModule} from "@angular/material/checkbox";
  import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
  import {JsonPipe, NgForOf} from '@angular/common';
  import {MatIcon} from "@angular/material/icon";
  import {MatInputModule} from "@angular/material/input";
  import {MatButton} from "@angular/material/button";
  import {OngsService} from "../../service/ongs/ongs.service";
  import {CategoriesOngs} from "../../model/categories-ongs/categories-ongs.model";
  import {StringifyPipe} from "../../../../shared/stringify.pipe";
  @Component({
    selector: 'app-filter-ongs',
    standalone: true,
    imports: [
      MatCheckboxModule,
      FormsModule,
      ReactiveFormsModule,
      JsonPipe,
      StringifyPipe,
      MatIcon,
      MatInputModule,
      NgForOf,
      MatButton,

    ],
    templateUrl: './filter-ongs.component.html',
    styleUrl: './filter-ongs.component.css'
  })

  export class FilterOngsComponent implements OnInit {

    categories:CategoriesOngs[]=[];
    toppings: any= FormGroup;

    @Output() ongSearched = new EventEmitter<any>();

    constructor(private _formBuilder: FormBuilder,private ongsService: OngsService) {
      this.toppings = this._formBuilder.group({ 'address': '' });
    }

    ngOnInit() {
      this.getCategoryChecksBoxs()
    }

    getCategoryChecksBoxs(){
      this.ongsService.getCategoriesOngs().subscribe((res:any)=> {
          this.categories = res.map((item:any)=>
          {
            this.toppings.addControl(item.id, new FormControl(false));
            return item
          })
        },error => console.log(error)
      )
    }

    filterOng(){
      const keys = Object.keys(this.toppings.value)
        .filter(key => this.toppings.value[key] === true)
        .map(key => parseInt(key, 10));
      this.ongSearched.emit({'address': this.toppings.value.address,'categories':keys})
    }



  }
