import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface IInputsConfig {
  type: string;
  label: string;
  controlName: string;
  validationText?: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../../../app.component.styl']
})
export class SignupComponent {
  @Output() snackBar = new EventEmitter();
  signupForm: FormGroup = new FormGroup({
    username: new FormControl('', [ Validators.required, ({ value }) => value.replace(/[\w-]+/g, '') ]),
    email: new FormControl('', [ Validators.required, Validators.email, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$') ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
    confirmPassword: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
  });

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
      validationText: 'Password minimum length is 4',
    },
    {
      type: 'password',
      label: 'Confirm password',
      controlName: 'confirmPassword',
    },
  ];

  constructor(private http: HttpClient, private router: Router) { }

  signup(): void {
    this.http.post('http://localhost:8000/api/user/signup', this.signupForm.value)
      .subscribe(
        ({ message }: { message: string }): void => {
          this.snackBar.emit(message);
          this.router.navigate(['/login']);
        },
        ({ error: { message } }): void => message && this.snackBar.emit(message),
      );
  }

  validation(name: string): boolean {
    return this.signupForm.controls[name].errors && this.signupForm.controls[name].touched;
  }

  get disabledButton(): boolean {
    const { password, confirmPassword } = this.signupForm.value;
    return this.signupForm.invalid || (password !== confirmPassword);
  }
}
