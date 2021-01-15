import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import SwiperCore, { Navigation } from 'swiper/core';

import { IPhotos, ISelectedPhotos } from 'src/app/interfaces';
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
  isSelect: boolean = false;
  selectedPhotos: ISelectedPhotos[] = [];
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

  selectCheckbox(photoId: string, photoIndex: number): void {
    if (this.selectedPhotos.map(photo => photo.photoIndex).includes(photoIndex)) {
      this.selectedPhotos = this.selectedPhotos.filter(photo => photo.photoIndex !== photoIndex);
      return;
    }

    this.selectedPhotos.push({ photoId, photoIndex  });
  }

  deleteSelected(): void {
    this.photosService.isLoading = true;
    this.photosService.photos = this.photosService.photos
      .filter(({ _id }) => this.selectedPhotos.every(({ photoId }) => photoId !== _id));
    this.http.patch(`${environment.baseUrl}/${ApiPaths.DeleteSelected}`, { selectedPhotos: this.selectedPhotos }).subscribe(
      () => {},
      () => {},
      () => {
        this.photosService.isLoading = false;
        this.isSelect = false;
      },
    );
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

  download(photo: string): void {
    const aTag = document.createElement('a');
    document.body.appendChild(aTag);
    aTag.href = photo;
    aTag.download = 'untitled.png';
    aTag.click();
    aTag.remove();
  }
}
