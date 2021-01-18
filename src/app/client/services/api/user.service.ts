import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from 'src/environments/environment';
import { IFrontUser, IInputsConfig } from 'src/app/interfaces';
import { ApiPaths } from 'src/app/enums';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userData: IFrontUser;
  headers: HttpHeaders = new HttpHeaders({ token: localStorage.getItem('token') });
  inputsConfig: IInputsConfig[] = [
    {
      type: 'text',
      label: 'Username',
      controlName: 'username',
      validationText: 'Word range 3-20 and must not contain special symbols.',
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
      validationText: 'Minimum length is 3',
    },
    {
      type: 'password',
      label: 'Confirm password',
      controlName: 'confirmPassword',
      validationText: 'Minimum length is 3',
    },
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) { }

  signup(signupForm: FormGroup): void {
    this.http.post<string>(`${environment.baseUrl}/${ApiPaths.Signup}`, signupForm).subscribe(
      (message: string): void => {
        this.snackBar(message);
        this.router.navigate(['/login']);
      },
      ({ error: { message } }) => message && this.snackBar(message),
    );
  }

  login(loginForm: FormGroup): void {
    this.http.post<string>(`${environment.baseUrl}/${ApiPaths.Login}`, loginForm).subscribe(
      (token: string): void => {
        localStorage.setItem('token', token);
        this.router.navigate(['/']).then(() => window.location.reload());
      },
      ({ error: { message } }) => this.snackBar(message),
    );
  }

  getUser(): void {
    this.http.get<IFrontUser>(`${environment.baseUrl}/${ApiPaths.GetUser}`, { headers: this.headers }).subscribe(
      (user: IFrontUser) => this.userData = user,
      (error) => {
        if (error.statusCode === 500) {
          this.logout();
        }
      },
    );
  }

  deleteAccount(): void {
    this.http.delete(`${environment.baseUrl}/${ApiPaths.DeleteUser}/${this.userData._id}`).subscribe(() => this.logout());
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']).then(() => window.location.reload());
  }

  editUsername(newUsername: string): void {
    const body = { id: this.userData._id, newUsername };
    this.http.patch(`${environment.baseUrl}/${ApiPaths.EditUsername}`, body).subscribe(() => this.getUser());
  }

  validation(name: string, formGroup: FormGroup): boolean {
    const { [name]: controlName } = formGroup.controls;
    return (controlName.errors && controlName.touched && controlName.value);
  }

  snackBar(message: string): void {
    this._snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
