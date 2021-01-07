import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

interface IData {
  toke: string;
  message: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.styl']
})
export class RegisterComponent {
  registrationForm: FormGroup = new FormGroup({
    username: new FormControl('', [ Validators.required, this.validateName ]),
    email: new FormControl('', [ Validators.required, Validators.email, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$') ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
    confirmPassword: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  createUser(): void {
    this.http.post('http://localhost:8000/api/user/register', this.registrationForm.value)
      .subscribe(
        (data: IData): void => {
          this._snackBar(data.message);
          this.router.navigate(['/login']);
        },
        (e: HttpErrorResponse): void => {
          const { error: { message } } = e;
          message && this._snackBar(message);
          console.log('Error:', e);
        },
      );
  }

  private _snackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 10000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  private validateName(control: AbstractControl): ValidationErrors {
    return control.value.replace(/[\w-]+/g, '');
  }

  get comparePasswords() {
    const { password, confirmPassword } = this.registrationForm.value;
    return password === confirmPassword ? '' : 'Password confirmation is incorrect';
  }
}
