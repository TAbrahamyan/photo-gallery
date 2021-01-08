import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface IInputsConfig {
  type: string;
  label: string;
  controlName: string;
  validationText: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../../app.component.styl']
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

  constructor(private http: HttpClient, private router: Router) { }

  login(): void {
    this.http.post('http://localhost:8000/api/user/login', this.loginForm.value)
      .subscribe(
        ({ token }: { token: string }): void => {
          localStorage.setItem('token', token);
          this.router.navigate(['/home']);
        },
        ({ error: { message } }): void => this.snackBar.emit(message),
      );
  }

  validation(name: string): boolean {
    return this.loginForm.controls[name].errors && this.loginForm.controls[name].touched;
  }
}
