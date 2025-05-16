import {Component, OnInit} from '@angular/core';
import {FooterContent2Component} from "../../../public/footer-content-2/footer-content-2.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatLabel, MatSuffix} from "@angular/material/form-field";
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {UsersService} from "../../service/users/users.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogEmailCodeComponent} from "../../components/dialog-email-code/dialog-email-code.component";
import emailjs from "emailjs-com";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    FooterContent2Component,
    FormsModule,
    MatButton,
    MatLabel,
    MatSuffix,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    MatIcon
  ],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent {
  username: string = "";
  user: any = {};
  userEmails: string[] = [];
  showError: boolean = false;

  constructor(
    private userService: UsersService,
    private dialog: MatDialog
  ) {
    emailjs.init('rl49lxhRhnbFkQ0Ol');
    this.getUserEmails();
  }

  VerifyEmail(): void {
    if (this.username.trim() === '') {
      console.error('Correo electrónico vacío');
      return;
    }

    if (!this.userEmails.includes(this.username)) {
      console.error('Correo electrónico no válido');
      this.showError = true;
      return;
    }

    this.showError = false;

    this.userService.verifyEmail({ username: this.username }).subscribe((validEmail: boolean) => {
      if (validEmail) {
        const idTemporal = localStorage.getItem('id-temporal');
        if (idTemporal) {
          this.getUser();
          this.dialog.open(DialogEmailCodeComponent);
        } else {
          console.error('ID temporal no encontrado después de la verificación del correo.');
        }
      }
    });
  }

  onInputChange(): void {
    if (!this.userEmails.includes(this.username)) {
      this.showError = true;
    } else {
      this.showError = false;
    }
  }

  getUser() {
    const idTemporal = localStorage.getItem('id-temporal');
    if (idTemporal) {
      this.userService.getUserById(Number(idTemporal)).subscribe((data) => {
        this.user = data;
        this.sendEmail();
      }, error => {
        console.error('Error al obtener el usuario:', error);
      });
    } else {
      console.error('ID temporal no encontrado');
    }
  }

  sendEmail() {
    const verificationCode = this.generateVerificationCode();
    this.userService.setVerificationCode(verificationCode);
    const templateParams = {
      name: this.user.name,
      verification_code: verificationCode,
      email: this.user.email,
    };
    emailjs.send('service_mwkwbme', 'template_kjdnrui', templateParams)
      .then((response) => {
        console.log('Email enviado con éxito:', response);
      }, (error) => {
        console.error('Error al enviar el correo electrónico:', error);
      });
  }

  generateVerificationCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  getUserEmails() {
    this.userService.getUsers().subscribe((users: any[]) => {
      this.userEmails = users.map(user => user.email);
    }, error => {
      console.error('Error al obtener la lista de correos electrónicos de los usuarios:', error);
    });
  }
}
