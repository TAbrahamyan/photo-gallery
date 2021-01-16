import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { IInputsConfig } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';
import { ApiPaths } from '../../enums/ApiPaths';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../../app.component.styl'],
})
export class LoginComponent {
  @Output() snackBar = new EventEmitter();
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.email, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$') ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
  });

  get inputsConfig(): IInputsConfig[] {
    return this.authService.inputsConfig;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    public authService: AuthService,
  ) { }

  login(): void {
    this.http.post<string>(`${environment.baseUrl}/${ApiPaths.Login}`, this.loginForm.value).subscribe(
      (token: string): void => {
        localStorage.setItem('token', token);
        this.router.navigate(['/']);
      },
      ({ error: { message } }) => this.snackBar.emit(message),
    );
  }
}
