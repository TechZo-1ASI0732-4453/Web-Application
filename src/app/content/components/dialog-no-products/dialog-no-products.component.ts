import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {DialogRef} from "@angular/cdk/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dialog-no-products',
  standalone: true,
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle,
        MatIcon
    ],
  templateUrl: './dialog-no-products.component.html',
  styleUrl: './dialog-no-products.component.css'
})
export class DialogNoProductsComponent {
  constructor(private dialogRef: DialogRef<DialogNoProductsComponent>,private router: Router) {}

  postProduct(){
    this.router.navigateByUrl('/home/post')
    this.dialogRef.close();
  }

}
