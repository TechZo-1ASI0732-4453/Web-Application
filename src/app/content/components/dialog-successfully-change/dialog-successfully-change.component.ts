import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-dialog-successfully-change',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatIcon
  ],
  templateUrl: './dialog-successfully-change.component.html',
  styleUrl: './dialog-successfully-change.component.css'
})
export class DialogSuccessfullyChangeComponent {

}
