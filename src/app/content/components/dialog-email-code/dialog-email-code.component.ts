import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {DialogRef} from "@angular/cdk/dialog";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MatLabel} from "@angular/material/form-field"
import {UsersService} from "../../service/users/users.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-dialog-email-code',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatIcon,
    FormsModule,
    MatLabel,
    RouterLink,
    NgIf
  ],
  templateUrl: './dialog-email-code.component.html',
  styleUrl: './dialog-email-code.component.css'
})
export class DialogEmailCodeComponent {
  code: string = "";
  errorMessage: string = "";

  constructor(private dialogRef: DialogRef<DialogEmailCodeComponent>, private router: Router, private userService: UsersService) {}

  verify() {
    if (this.userService.verifyCode(this.code)) {
      this.router.navigateByUrl('/change-password');
      this.dialogRef.close();
    } else {
      this.errorMessage = "Código incorrecto";
    }
  }

  clearErrorMessage(): void {
    this.errorMessage = "";
  }

  onCodeInput(): void {
    this.clearErrorMessage();
  }
}
