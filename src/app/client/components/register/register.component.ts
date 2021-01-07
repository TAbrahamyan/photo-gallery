import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
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
          this._snackBar(e.error.message);
          console.log('E:', e);
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
}
