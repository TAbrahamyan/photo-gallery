import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiPaths } from 'src/app/client/enums/ApiPaths';
import { IFrontUser } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html'
})
export class ProfileDialogComponent {
  userData: IFrontUser;
  isLoading: boolean = false;
  isEdit: boolean = false;
  inputVal: string = '';
  headers: HttpHeaders = new HttpHeaders({
    token: localStorage.getItem('token'),
  });

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.isLoading = true;
    this.http.get<IFrontUser>(`${environment.baseUrl}/${ApiPaths.GetUser}`, { headers: this.headers }).subscribe(
      (user: IFrontUser) => this.userData = user,
      () => {},
      () => this.isLoading = false,
    );
  }

  deleteAccount(): void {
    this.http.delete(`${environment.baseUrl}/${ApiPaths.DeleteUser}/${this.userData._id}`).subscribe(() => {
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }

  editUsernameHandler(): void {
    if (!this.inputVal) {
      return alert('Input can not be empty');
    }

    this.http.patch(`${environment.baseUrl}/${ApiPaths.EditUsername}`, { id: this.userData._id, newUsername: this.inputVal })
      .subscribe(() => this.getUser());
    this.isEdit = false;
  }

  isEditHandler(): void {
    this.isEdit = true;
    this.inputVal = this.userData.username;
  }
}
