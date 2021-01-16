import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { IInputsConfig } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';
import { ApiPaths } from '../../enums/ApiPaths';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../../../app.component.styl'],
})
export class SignupComponent {
  @Output() snackBar = new EventEmitter();
  signupForm: FormGroup = new FormGroup({
    username: new FormControl('', [ Validators.required, ({ value }) => value.replace(/[\w-]+/g, '') ]),
    email: new FormControl('', [ Validators.required, Validators.email, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$') ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
    confirmPassword: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
  });

  get inputsConfig(): IInputsConfig[] {
    return this.authService.inputsConfig;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    public authService: AuthService,
  ) { }

  signup() {
    const { password, confirmPassword } = this.signupForm.value;

    if (password !== confirmPassword) {
      return this.snackBar.emit('Password confirmation is incorrect');
    }

    this.http.post<string>(`${environment.baseUrl}/${ApiPaths.Signup}`, this.signupForm.value).subscribe(
      (message: string): void => {
        this.snackBar.emit(message);
        this.router.navigate(['/login']);
      },
      ({ error: { message } }) => message && this.snackBar.emit(message),
    );
  }
}
