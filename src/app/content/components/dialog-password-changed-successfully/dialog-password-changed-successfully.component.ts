import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-dialog-password-changed-successfully',
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
  templateUrl: './dialog-password-changed-successfully.component.html',
  styleUrl: './dialog-password-changed-successfully.component.css'
})
export class DialogPasswordChangedSuccessfullyComponent {

}
