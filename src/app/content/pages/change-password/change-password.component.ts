import { Component } from '@angular/core';
import {FooterContent2Component} from "../../../public/footer-content-2/footer-content-2.component";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatLabel, MatSuffix} from "@angular/material/form-field";
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {CustomValidators} from "../../service/validators/validators.service";
import {MatDialog} from "@angular/material/dialog";
import {UsersService} from "../../service/users/users.service";
import {MatIcon} from "@angular/material/icon";
import {
  DialogPasswordChangedSuccessfullyComponent
} from "../../components/dialog-password-changed-successfully/dialog-password-changed-successfully.component";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    FooterContent2Component,
    FormsModule,
    MatButton,
    MatLabel,
    NgIf,
    RouterLink,
    MatSuffix,
    ReactiveFormsModule,
    MatIcon
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  hide = true;
  hiderepeat = true;
  submitted = false;

  changepasswordForm = this.formBuilder.group({
    contrasenia: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
      ],
    ],
    confirmacionContrasenia: ['', Validators.required],
  }, {
    validators: CustomValidators.mustBeEqual('contrasenia', 'confirmacionContrasenia'),
  });

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private usersService: UsersService
  ) {}

  hide1(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  hide2(event: MouseEvent) {
    this.hiderepeat = !this.hiderepeat;
    event.stopPropagation();
  }

  changePassword() {
    this.submitted = true;

    if (this.changepasswordForm.valid) {
      const newPassword = this.changepasswordForm.controls.contrasenia.value;
      const userId = localStorage.getItem('id-temporal');

      if (userId && newPassword) {
        this.usersService.changePassword(Number(userId), newPassword).subscribe(
          response => {
            localStorage.removeItem('id-temporal');
            this.dialog.open(DialogPasswordChangedSuccessfullyComponent);
          }
        );
      }
    }
  }

}
