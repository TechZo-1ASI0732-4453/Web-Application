import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FooterContent2Component} from "../../../public/footer-content-2/footer-content-2.component";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {RouterLinkActive} from "@angular/router";
import {DialogRegisterSuccessfullyComponent} from "../../components/dialog-register-successfully/dialog-register-successfully.component";
import {MatDialog} from "@angular/material/dialog";
import { FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../../service/validators/validators.service';
import {NgClass, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import { UsersService } from "../../service/users/users.service";
import {AuthGoogleService} from "../../service/auth-google/auth-google.service";
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    FooterContent2Component,
    MatLabel,
    MatButtonModule,
    RouterLink,
    ReactiveFormsModule,
    NgIf,
    MatSuffix,
    RecaptchaModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  hide = true;
  hiderepeat = true;
  submitted = false;
  recaptchaToken: string | null = null;
  captchaInvalid: boolean = false;
  recaptchaSiteKey = '6LcJQUorAAAAAOYbo-uVM_Fxb-rWRGq5clT9RJ1D'; // Replace with your actual reCAPTCHA site key

  registerForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, CustomValidators.validEmail]],
    tel: [
      '',
      [
        Validators.required,
        Validators.maxLength(9),
        Validators.minLength(9),
        CustomValidators.onlyNumbers,
      ],
    ],
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
    private authGoogleService: AuthGoogleService,
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

  register(){
    this.dialog.open(DialogRegisterSuccessfullyComponent, {
    });
  }

  registerWithGoogle() {
    this.authGoogleService.loginWithGoogle().then(userCredential => {
      const user = userCredential.user;
      const email = user.email;

      if (!email) {
        console.error('El correo de Google es inválido o no está disponible.');
        return;
      }

      const password = this.authGoogleService.googlePassword;
      const newUser = {
        username: email,
        name: user.displayName,
        password,
        phoneNumber: user.phoneNumber || '',
        profilePicture: user.photoURL,
        isGoogleAccount: true,
        roles: ["ROLE_USER"]
      };

      this.usersService.getUserByUsername(email).subscribe({
        next: () => {
          this.usersService.login({ username: email, password }).subscribe({
            next: (response: any) => {
              localStorage.setItem('token', response.token);
              window.location.href = '/home';
            },
            error: err => {
              console.error('Login failed:', err);
            }
          });
        },
        error: () => {
          this.usersService.register(newUser).subscribe({
            next: () => {
              this.usersService.login({ username: email, password }).subscribe({
                next: (response: any) => {
                  localStorage.setItem('token', response.token);
                  window.location.href = '/home';
                },
                error: err => {
                  console.error('Login after register failed:', err);
                }
              });
            },
            error: err => {
              console.error('Error registering user:', err);
            }
          });
        }
      });
    }).catch(error => {
      console.error('Google Sign-In Error:', error);
    });
  }

  resolved(event: string) {
    this.recaptchaToken = event;
  }

  addUser() {

    if(!this.recaptchaToken) {
      this.captchaInvalid = true;
      return;
    }else {
      this.captchaInvalid = false;
    }

    if (this.registerForm.valid) {
      const newUser = {
        username: this.registerForm.value.email,
        password: this.registerForm.value.contrasenia,
        name: this.registerForm.value.name,
        phoneNumber: this.registerForm.value.tel,
        profilePicture: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
        isGoogleAccount: false,
        roles: ["ROLE_USER"]
      };

      this.usersService.register(newUser).subscribe({
        next: () => {
          const ref = this.dialog.open(DialogRegisterSuccessfullyComponent);
          ref.afterClosed().subscribe(() => {
            window.location.href = '/login';
          });
        },
        error: err => {
          console.error('Error registering user:', err);
        }
      });
    } else {
      this.submitted = true;
    }
  }

}
