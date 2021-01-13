import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import SwiperCore, { Navigation } from 'swiper/core';

import { environment } from 'src/environments/environment';
import { ApiPaths } from '../../enums/ApiPaths';
import { PhotosService } from '../../services/photos.service';

SwiperCore.use([Navigation]);

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.styl']
})
export class PhotosComponent implements OnInit {
  photoIndex: number = -1;
  isShowSlider: boolean = false;
  isLoading: boolean = false;
  headers: HttpHeaders = new HttpHeaders({
    token: localStorage.getItem('token'),
  });

  get photos(): string[] {
    return this.photosService.photos;
  }

  constructor(
    private http: HttpClient,
    private photosService: PhotosService,
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.http.get<string[]>(`${environment.baseUrl}/${ApiPaths.GetPhotos}`, { headers: this.headers }).subscribe(
      (data: string[]) => {
        this.photosService.photos = data;
      },
      () => {},
      () => this.isLoading = false,
    );
  }

  isShowSliderHandler(index: number): void {
    this.photoIndex = index;
    this.isShowSlider = true;
  }

  deletePhoto(photoIndex: number): void {
    this.isLoading = true;
    this.http.delete<string[]>(`${environment.baseUrl}/${ApiPaths.DeletePhoto}/${photoIndex}`, { headers: this.headers }).subscribe(
      (data: string[]) => {
        this.photosService.photos = data;
      },
      () => {},
      () => this.isLoading = false,
    );
  }
}
