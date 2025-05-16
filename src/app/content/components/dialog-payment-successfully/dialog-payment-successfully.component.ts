import {Component, Inject, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {UsersService} from "../../service/users/users.service";
import {MembershipsService} from "../../service/memberships/memberships.service";
import {ActivatedRoute} from "@angular/router";
import {DialogSuccessfullyChangeComponent} from "../dialog-successfully-change/dialog-successfully-change.component";

@Component({
  selector: 'app-dialog-payment-successfully',
  standalone: true,
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle,
        MatIcon
    ],
  templateUrl: './dialog-payment-successfully.component.html',
  styleUrl: './dialog-payment-successfully.component.css'
})
export class DialogPaymentSuccessfullyComponent {
  constructor( @Inject(MAT_DIALOG_DATA) public data: any) {
  }


}
