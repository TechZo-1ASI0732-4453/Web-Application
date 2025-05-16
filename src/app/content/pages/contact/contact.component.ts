import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCheckbox } from "@angular/material/checkbox";
import { MatIcon } from "@angular/material/icon";
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckbox,
    MatIcon
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  email = new FormControl('', [Validators.required, Validators.email]);
  name = new FormControl('', [Validators.required]);
  phone = new FormControl('');
  message = new FormControl('', [Validators.required]);  
  errorMessage = '';

  constructor() {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage = 'Debes ingresar un valor';
    } else if (this.email.hasError('email')) {
      this.errorMessage = 'Correo no válido';
    } else {
      this.errorMessage = '';
    }
  }

  sendEmail() {
    if (this.email.invalid || this.name.invalid || this.message.invalid) {
      alert('Completa todos los campos obligatorios.');
      return;
    }

    const templateParams = {
      from_name: this.name.value,
      email: this.email.value,
      phone: this.phone.value,
      message: this.message.value
    };

    emailjs.send('service_n1ojeiz', 'template_akfqe76', templateParams, 'lxgr2Cag9uXB3-qzt')
      .then(() => {
        alert('Correo enviado correctamente');
        this.name.reset();
        this.email.reset();
        this.phone.reset();
        this.message.reset();
      })
      .catch((error) => {
        console.error('Error al enviar:', error);
        alert('Hubo un problema al enviar el mensaje');
      });
  }
}
