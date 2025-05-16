import { Component } from '@angular/core';
import {DialogRef} from "@angular/cdk/dialog";
import {Router, RouterLink} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-dialog-post-review',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatIcon,
    RouterLink
  ],
  templateUrl: './dialog-post-review.component.html',
  styleUrl: './dialog-post-review.component.css'
})
export class DialogPostReviewComponent {
  constructor(private dialogRef: DialogRef<DialogPostReviewComponent>,private router: Router) {}
}
