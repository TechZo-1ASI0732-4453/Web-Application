import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-dialog-denied-offer',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatIcon,
    MatDialogClose,
    RouterLink
  ],
  templateUrl: './dialog-denied-offer.component.html',
  styleUrl: './dialog-denied-offer.component.css'
})
export class DialogDeniedOfferComponent {

}
