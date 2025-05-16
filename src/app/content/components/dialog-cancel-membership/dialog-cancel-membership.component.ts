import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-dialog-cancel-membership',
  standalone: true,
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle,
        MatIcon
    ],
  templateUrl: './dialog-cancel-membership.component.html',
  styleUrl: './dialog-cancel-membership.component.css'
})
export class DialogCancelMembershipComponent {

  constructor(private dialogRef: MatDialogRef<DialogCancelMembershipComponent>) {}

  confirmDelete(): void {
    this.dialogRef.close('confirm');
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
