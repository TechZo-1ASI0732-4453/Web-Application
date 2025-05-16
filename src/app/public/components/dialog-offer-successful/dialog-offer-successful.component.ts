import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-dialog-offer-successful',
  standalone: true,
  imports: [
    MatDialogContent,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatIcon,
    RouterLink
  ],
  templateUrl: './dialog-offer-successful.component.html',
  styleUrl: './dialog-offer-successful.component.css'
})
export class DialogOfferSuccessfulComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

}
