import { Component } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-dialog-favorites',
  templateUrl: './dialog-favorites.component.html',
  styleUrls: ['./dialog-favorites.component.css'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIcon, MatDialogClose, MatDialogTitle, MatDialogContent, MatDialogActions]
})
export class DialogFavoritesComponent {
  constructor(public dialogRef: MatDialogRef<DialogFavoritesComponent>) {}

  confirm() {
    this.dialogRef.close();
  }
}
