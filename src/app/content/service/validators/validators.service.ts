import { Injectable } from '@angular/core';
import { Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class CustomValidators extends Validators {
  static onlyNumbers(control: AbstractControl): ValidationErrors | null {
    return /^\d+$/.test(control.value) ? null : { onlyNumbers: true };
  }

  static mustBeEqual(nombrePrimerControl: string, nombreSegundoControl: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const primerControl = group.get(nombrePrimerControl);
      const segundoControl = group.get(nombreSegundoControl);
      return primerControl?.value === segundoControl?.value ? null : { mustBeEqual: true };
    };
  }

  static validEmail(control: AbstractControl): ValidationErrors | null {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(control.value) ? null : { validEmail: true };
  }

  static atLeastOneNumber(control: AbstractControl): ValidationErrors | null {
    return /\d+/.test(control.value) ? null : { toNumber: true };
  }

  static atLeastOneUppercase(control: AbstractControl): ValidationErrors | null {
    return /[A-Z]+/.test(control.value) ? null : { atLeastOneUppercase: true };
  }

  static atLeastOneLowercase(control: AbstractControl): ValidationErrors | null {
    return /[a-z]+/.test(control.value) ? null : { atLeastOneLowercase: true };
  }


  static mustBeDifferent(firstField: string, secondField: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const firstControl = group.get(firstField);
      const secondControl = group.get(secondField);
      return firstControl?.value != secondControl?.value ? null : { mustBeDifferent: true };
    };
  }
}
