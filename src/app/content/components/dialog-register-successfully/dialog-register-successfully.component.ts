import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {DialogRef} from "@angular/cdk/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dialog-register-successfully',
  standalone: true,
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle,
        MatIcon
    ],
  templateUrl: './dialog-register-successfully.component.html',
  styleUrl: './dialog-register-successfully.component.css'
})
export class DialogRegisterSuccessfullyComponent {

  constructor(private dialogRef: DialogRef<DialogRegisterSuccessfullyComponent>,private router: Router) {}

  onLogin(){
    this.router.navigateByUrl('/login')
    this.dialogRef.close();
  }
}
