import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { IInputsConfig } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';
import { ApiPaths } from '../../enums/ApiPaths';
import { LoginSignupService } from '../../services/login-signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../../../app.component.styl'],
})
export class SignupComponent {
  signupForm: FormGroup = new FormGroup({
    username: new FormControl('', [ Validators.required, ({ value }) => value.replace(/[\w-]+/g, '') ]),
    email: new FormControl('', [ Validators.required, Validators.email, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$') ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
    confirmPassword: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
  });

  get inputsConfig(): IInputsConfig[] {
    return this.loginSignupService.inputsConfig;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private loginSignupService: LoginSignupService,
  ) { }

  signup(): void {
    const { password, confirmPassword } = this.signupForm.value;

    if (password !== confirmPassword) {
      return this.loginSignupService.snackBar('Password confirmation is incorrect');
    }

    this.http.post<string>(`${environment.baseUrl}/${ApiPaths.Signup}`, this.signupForm.value).subscribe(
      (message: string): void => {
        this.loginSignupService.snackBar(message);
        this.router.navigate(['/login']);
      },
      ({ error: { message } }): void => message && this.loginSignupService.snackBar(message),
    );
  }

  validation(name: string): boolean {
    const { [name]: controlName } = this.signupForm.controls;
    return controlName.errors && controlName.touched && controlName.value;
  }
}
