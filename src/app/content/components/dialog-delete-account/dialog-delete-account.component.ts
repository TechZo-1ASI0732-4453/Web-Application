import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {MatDialogRef} from '@angular/material/dialog'; // Importa MatDialogRef
import {Router} from "@angular/router";

@Component({
  selector: 'app-dialog-delete-account',
  standalone: true,
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle,
        MatIcon
    ],
  templateUrl: './dialog-delete-account.component.html',
  styleUrl: './dialog-delete-account.component.css'
})
export class DialogDeleteAccountComponent {

  constructor(private dialogRef: MatDialogRef<DialogDeleteAccountComponent>) {}

  confirmDelete(): void {
    this.dialogRef.close('confirm');
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
