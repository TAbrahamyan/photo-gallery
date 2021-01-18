import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { IPhotos, IPhotosData } from 'src/app/interfaces';
import { ApiPaths } from 'src/app/enums';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  photosData: IPhotosData = { photos: [], date: [], isLoading: false };
  headers: HttpHeaders = new HttpHeaders({ token: localStorage.getItem('token') });

  constructor(private http: HttpClient) { }

  getPhotos(): void {
    this.photosData.isLoading = true;
    this.http.get<IPhotos[]>(`${environment.baseUrl}/${ApiPaths.GetPhotos}`, { headers: this.headers }).subscribe(
      (data: IPhotos[]) => {
        this.photosData.photos = data;
        const getPhotosDate = data
          .map(({ createdAt }) => new Date(createdAt).toDateString())
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        this.photosData.date.length = 0;
        this.photosData.date.push(...new Set(getPhotosDate));
      },
      () => {},
      () => this.photosData.isLoading = false,
    );
  }

  uploadPhoto(res: string | ArrayBuffer, fileName: string): void {
    this.http.post<IPhotos>(
      `${environment.baseUrl}/${ApiPaths.UploadPhotos}`,
      { photo: res, name: fileName },
      { headers: this.headers },
    ).subscribe(() => this.getPhotos());
  }

  deletePhoto(id: string): void {
    this.http.delete<IPhotos>(`${environment.baseUrl}/${ApiPaths.DeletePhoto}/${id}`).subscribe(() => this.getPhotos());
  }

  bulkDelete(photosId: string[]): void {
    this.http.patch(`${environment.baseUrl}/${ApiPaths.BulkDelete}`, { photosId }).subscribe(() => this.getPhotos());
  }
}
