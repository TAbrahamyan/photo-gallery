import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { ApiPaths } from '../../enums/ApiPaths';
import { PhotosService } from '../../services/photos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.styl']
})
export class HomeComponent implements OnInit {
  @ViewChild('uploadPhoto') uploadPhoto: ElementRef;
  username: string = '';
  headers: HttpHeaders = new HttpHeaders({
    token: localStorage.getItem('token'),
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private photosService: PhotosService,
  ) { }

  ngOnInit(): void {
    this.http.get<string>(`${environment.baseUrl}/${ApiPaths.GetUser}`, { headers: this.headers }).subscribe(
      (username: string): string => this.username = username,
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

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  uploadPhotoHandler({ target: { files } }): void {
    if (files && files[0]) {
      const reader: any = new FileReader();
      reader.onload = (): void => {
        this.photosService.photos.push(reader.result);
        this.http.post<string>(
          `${environment.baseUrl}/${ApiPaths.Upload}`,
          { photo: reader.result },
          { headers: this.headers },
        ).subscribe();
      };
      reader.readAsDataURL(files[0]);
    }
  }
}
