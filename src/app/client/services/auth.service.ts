import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IInputsConfig } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  inputsConfig: IInputsConfig[] = [
    {
      type: 'text',
      label: 'Username',
      controlName: 'username',
      validationText: 'Username must not contain special symbols',
    },
    {
      type: 'email',
      label: 'Email',
      controlName: 'email',
      validationText: 'Invalid email',
    },
    {
      type: 'password',
      label: 'Password',
      controlName: 'password',
      validationText: 'Minimum length is 4',
    },
    {
      type: 'password',
      label: 'Confirm password',
      controlName: 'confirmPassword',
      validationText: 'Minimum length is 4',
    },
  ];

  validation(name: string, formGroup: FormGroup): boolean {
    const { [name]: controlName } = formGroup.controls;
    return controlName.errors && controlName.touched && controlName.value;
  }
}
