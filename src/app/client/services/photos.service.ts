import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IPhotos } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';
import { ApiPaths } from '../enums/ApiPaths';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {
  photos: IPhotos[] = [];
  isLoading: boolean = false;
  headers: HttpHeaders = new HttpHeaders({
    token: localStorage.getItem('token'),
  });

  constructor(private http: HttpClient) { }

  getPhotos(): void {
    this.isLoading = true;
    this.http.get<IPhotos[]>(`${environment.baseUrl}/${ApiPaths.GetPhotos}`, { headers: this.headers }).subscribe(
      (data: IPhotos[]) => this.photos = data,
      () => {},
      () => this.isLoading = false,
    );
  }
}
