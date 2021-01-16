import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { IPhotos } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';
import { ApiPaths } from '../../enums/ApiPaths';
import { PhotosService } from '../../services/photos.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [`
    .example-spacer { flex: 1 1 auto }
    button { margin: 0.5rem }
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
    private _snackBar: MatSnackBar,
    private photosService: PhotosService,
  ) { }

  ngOnInit(): void {
    this.http.get<string>(`${environment.baseUrl}/${ApiPaths.GetUser}`, { headers: this.headers }).subscribe(
      (data: any) => this.username = data.username,
      (error: HttpErrorResponse): void => {
        if (error.status === 500) {
          this.logout();
        }
      },
    );
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
        this.photosService.isLoading = true;
        this.http.post<IPhotos>(
          `${environment.baseUrl}/${ApiPaths.UploadPhotos}`,
          { photo: reader.result },
          { headers: this.headers },
        ).subscribe(
          (data: IPhotos) => this.photosService.photos.push(data),
          () => {},
          () => this.photosService.isLoading = false,
        );
      };
      reader.readAsDataURL(files[0]);
    }
  }
}
