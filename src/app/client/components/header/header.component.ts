import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { IFrontUser, IPhotos } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';
import { ApiPaths } from '../../enums/ApiPaths';
import { HomeService } from '../../services/home.service';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [`
    .example-spacer { flex: 1 1 auto }
    button { margin: 0.5rem }
    .open-profile:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  `],
})
export class HeaderComponent implements OnInit {
  @ViewChild('uploadPhoto') uploadPhoto: ElementRef;
  username: string = '';
  headers: HttpHeaders = new HttpHeaders({
    token: localStorage.getItem('token'),
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private homeService: HomeService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.http.get<IFrontUser>(`${environment.baseUrl}/${ApiPaths.GetUser}`, { headers: this.headers }).subscribe(
      (user: IFrontUser) => this.username = user.username,
      (error: HttpErrorResponse) => {
        if (error.status === 500) {
          this.logout();
        }
      },
    );
  }

  openProfile(): void {
    this.dialog.open(ProfileDialogComponent, {
      width: '30%',
      panelClass: 'profile-dialog',
      backdropClass: 'profile-backdrop',
    });
  }

  chooseFile(): void {
    this.uploadPhoto.nativeElement.click();
  }

  clearFileInputValue(event): void {
    event.target.value = '';
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  uploadPhotoHandler({ target: { files } }): void {
    if (!files[0].type.match('image.*')) {
      this._snackBar.open('Please upload only images', 'Close', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      return;
    }

    if (files && files[0]) {
      const reader: FileReader = new FileReader();
      reader.onload = (): void => {
        this.http.post<IPhotos>(
          `${environment.baseUrl}/${ApiPaths.UploadPhotos}`,
          { photo: reader.result, name: files[0].name },
          { headers: this.headers },
        ).subscribe(() => this.homeService.getPhotos());
      };
      reader.readAsDataURL(files[0]);
    }
  }
}
