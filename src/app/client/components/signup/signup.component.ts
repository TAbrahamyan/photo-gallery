import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.styl']
})
export class SignupComponent {
  signupForm: FormGroup = new FormGroup({
    username: new FormControl('', [ Validators.required, this.validateName ]),
    email: new FormControl('', [ Validators.required, Validators.email, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$') ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
    confirmPassword: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
  });

  @Output() snackBar = new EventEmitter();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  createUser(): void {
    this.http.post('http://localhost:8000/api/user/signup', this.signupForm.value)
      .subscribe(
        ({ message }: { message: string }): void => {
          this.snackBar.emit(message);
          this.router.navigate(['/login']);
        },
        ({ error: { message } }): void => message && this.snackBar.emit(message),
      );
  }

  private validateName(control: AbstractControl): ValidationErrors {
    return control.value.replace(/[\w-]+/g, '');
  }

  get comparePasswords(): string {
    const { password, confirmPassword } = this.signupForm.value;
    return password === confirmPassword ? '' : 'Password confirmation is incorrect';
  }
}
