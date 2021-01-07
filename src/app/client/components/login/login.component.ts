import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  @Output() snackBar = new EventEmitter();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  login(): void {
    this.http.post('http://localhost:8000/api/user/login', this.loginForm.value)
      .subscribe(
        ({ token }: { token: string }): void => {
          localStorage.setItem('token', token);
          this.router.navigate(['/home']);
        },
        ({ error: { message } }): void => this.snackBar.emit(message),
      )
  }
}
