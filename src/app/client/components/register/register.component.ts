import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.styl']
})
export class RegisterComponent {
  registrationForm = new FormGroup({
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
        (d: { token: string }): void => {
          console.log('Succesfull registered', d);
          this.router.navigate(['/login']);
        },
        (e: HttpErrorResponse): void => {
          console.log('E:', e);
          this.snackBar.open(e.error.message, 'Close', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        },
      );
  }
}
