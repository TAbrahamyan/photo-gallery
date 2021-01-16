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
  photosDate: string[] = [];
  isLoading: boolean = false;
  headers: HttpHeaders = new HttpHeaders({
    token: localStorage.getItem('token'),
  });

  constructor(private http: HttpClient) { }

  getPhotos(): void {
    this.isLoading = true;
    this.http.get<IPhotos[]>(`${environment.baseUrl}/${ApiPaths.GetPhotos}`, { headers: this.headers }).subscribe(
      (data: IPhotos[]) => {
        this.photos = data;
        const getPhotosDate = data
          .map(({ createdAt }) => new Date(createdAt).toDateString())
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        this.photosDate.length = 0;
        this.photosDate.push(...new Set(getPhotosDate));
      },
      () => {},
      () => this.isLoading = false,
    );
  }
}
