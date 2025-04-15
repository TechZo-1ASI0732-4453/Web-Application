import { Component, OnInit } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {FooterContent2Component} from "../../../public/footer-content-2/footer-content-2.component";
import {UsersService} from "../../service/users/users.service";
import {Users} from "../../model/users/users.model";
import {NgIf} from "@angular/common";
import {AuthGoogleService} from "../../service/auth-google/auth-google.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MatButton,
    MatLabel,
    FooterContent2Component,
    NgIf,
    MatSuffix,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = "";
  password: string = "";
  showError: boolean = false;
  errorMessage: string = "";
  hide = true;

  constructor(private router: Router, private userService: UsersService, private authGoogleService: AuthGoogleService) { }

  login(): void {
    this.showError = false;
    this.userService.login({ username: this.username, password: this.password }).subscribe((result: any) => {
      if (typeof result === 'object' && result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('id', result.id.toString());
        window.location.href = '/home';
      } else if (result === 'password') {
        this.errorMessage = 'Contraseña incorrecta';
      } else if (result === 'user') {
        this.errorMessage = 'Usuario no encontrado';
      } else {
        this.errorMessage = 'Error al intentar iniciar sesión';
      }
      if (result !== true && typeof result !== 'object') {
        this.showError = true;
      }
    });
  }

  loginWithGoogle(): void {
    this.authGoogleService.loginWithGoogle()
      .then(userCredential => {
        const user = userCredential.user;
        const email = user.email;
        const password = this.authGoogleService.googlePassword;
        if (!email) {
          this.errorMessage = 'El correo de Google es inválido o no disponible.';
          this.showError = true;
          return;
        }
        const doLogin = () => {
          this.userService.login({ username: email, password }).subscribe({
            next: (response: any) => {
              if (response && response.token && response.id) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('id', response.id.toString());
                window.location.href = '/home';
              } else {
                this.showError = true;
                this.errorMessage = 'No se recibió token o ID al iniciar sesión.';
              }
            },
            error: () => {
              this.showError = true;
              this.errorMessage = 'Login falló después del registro.';
            }
          });
        };
        const newUser = {
          username: email,
          name: user.displayName,
          password,
          phoneNumber: user.phoneNumber || '',
          profilePicture: user.photoURL,
          isGoogleAccount: true,
          roles: ["ROLE_USER"]
        };
        const attemptRegister = () => {
          localStorage.removeItem('token');
          this.userService.register(newUser).subscribe({
            next: () => {
              setTimeout(() => {
                doLogin();
              }, 500);
            },
            error: (err) => {
              console.error("Registration error: ", err);
              setTimeout(() => {
                doLogin();
              }, 500);
            }
          });
        };
        this.userService.getUserByUsername(email).subscribe({
          next: (res) => {
            if (res && Object.keys(res).length > 0) {
              doLogin();
            } else {
              attemptRegister();
            }
          },
          error: (err) => {
            console.error("getUserByUsername error: ", err);
            attemptRegister();
          }
        });
      })
      .catch(error => {
        this.errorMessage = 'Error al autenticar con Google.';
        this.showError = true;
        console.error(error);
      });
  }

  clearErrorMessage(): void {
    this.showError = false;
  }

  onUsernameInput(): void {
    this.clearErrorMessage();
  }

  onPasswordInput(): void {
    this.clearErrorMessage();
  }

  hide1(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }
}
