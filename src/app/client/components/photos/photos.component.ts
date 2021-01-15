import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import SwiperCore, { Navigation } from 'swiper/core';

import { IPhotos } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';
import { ApiPaths } from '../../enums/ApiPaths';
import { PhotosService } from '../../services/photos.service';

SwiperCore.use([ Navigation ]);

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.styl']
})
export class PhotosComponent implements OnInit {
  photoIndex: number = -1;
  isShowSlider: boolean = false;
  headers: HttpHeaders = new HttpHeaders({
    token: localStorage.getItem('token'),
  });

  get photos(): IPhotos[] {
    return this.photosService.photos;
  }

  get isLoading(): boolean {
    return this.photosService.isLoading;
  }

  constructor(
    private http: HttpClient,
    private photosService: PhotosService,
  ) { }

  ngOnInit(): void {
    this.photosService.isLoading = true;
    this.http.get<IPhotos[]>(`${environment.baseUrl}/${ApiPaths.GetPhotos}`, { headers: this.headers }).subscribe(
      (data: IPhotos[]) => this.photosService.photos = data,
      () => {},
      () => this.photosService.isLoading = false,
    );
  }

  isShowSliderHandler(index: number): void {
    this.photoIndex = index;
    this.isShowSlider = true;
  }

  download(photo: string): void {
    const aTag = document.createElement('a');
    document.body.appendChild(aTag);
    aTag.href = photo;
    aTag.download = 'untitled.png';
    aTag.click();
    aTag.remove();
  }

  deletePhoto(id: string): void {
    this.photosService.isLoading = true;
    this.photosService.photos = this.photosService.photos.filter(photo => photo._id !== id);
    this.http.delete<IPhotos>(`${environment.baseUrl}/${ApiPaths.DeletePhoto}/${id}`).subscribe(
      () => {},
      () => {},
      () => this.photosService.isLoading = false,
    );
  }
}
