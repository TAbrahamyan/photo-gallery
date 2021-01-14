import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { ApiPaths } from '../../enums/ApiPaths';

interface IInputsConfig {
  type: string;
  label: string;
  controlName: string;
  validationText: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  @Output() snackBar = new EventEmitter();
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.email, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$') ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
  });

  inputsConfig: IInputsConfig[] = [
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
      validationText: 'Password minimum length is 4',
    },
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  login(): void {
    this.http.post<string>(`${environment.baseUrl}/${ApiPaths.Login}`, this.loginForm.value).subscribe(
      (token: string): void => {
        localStorage.setItem('token', token);
        this.router.navigate(['/']);
      },
      ({ error: { message } }): void => this.snackBar.emit(message),
    );
  }

  validation(name: string): boolean {
    const { [name]: controlName } = this.loginForm.controls;
    return controlName.errors && controlName.touched && controlName.value;
  }
}
