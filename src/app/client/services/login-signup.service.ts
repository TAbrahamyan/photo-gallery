import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IInputsConfig } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LoginSignupService {
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

  constructor(private _snackBar: MatSnackBar) { }

  snackBar(message: string): void {
    this._snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
