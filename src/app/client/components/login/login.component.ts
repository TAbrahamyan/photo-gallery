import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { IInputsConfig } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';
import { ApiPaths } from '../../enums/ApiPaths';
import { LoginSignupService } from '../../services/login-signup.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../../app.component.styl'],
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.email, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$') ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
  });

  get inputsConfig(): IInputsConfig[] {
    return this.loginSignupService.inputsConfig;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private loginSignupService: LoginSignupService,
  ) { }

  login(): void {
    this.http.post<string>(`${environment.baseUrl}/${ApiPaths.Login}`, this.loginForm.value).subscribe(
      (token: string): void => {
        localStorage.setItem('token', token);
        this.router.navigate(['/']);
      },
      ({ error: { message } }): void => this.loginSignupService.snackBar(message),
    );
  }

  validation(name: string): boolean {
    const { [name]: controlName } = this.loginForm.controls;
    return controlName.errors && controlName.touched && controlName.value;
  }
}
