import { Component } from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-dialog-successful-product-edition',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton
  ],
  templateUrl: './dialog-successful-product-edition.component.html',
  styleUrl: './dialog-successful-product-edition.component.css'
})
export class DialogSuccessfulProductEditionComponent {

}
