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

  get photosDate(): string[] {
    return this.photosService.photosDate;
  }

  get isLoading(): boolean {
    return this.photosService.isLoading;
  }

  constructor(
    private http: HttpClient,
    private photosService: PhotosService,
  ) { }

  ngOnInit(): void {
    this.photosService.getPhotos();
  }

  isShowSliderHandler(index: number): void {
    if (!this.isSelect) {
      this.photoIndex = index;
      this.isShowSlider = true;
    }
  }

  deletePhoto(id: string): void {
    this.http.delete<IPhotos>(`${environment.baseUrl}/${ApiPaths.DeletePhoto}/${id}`)
      .subscribe(() => this.photosService.getPhotos());
  }

  selectPhoto(photo: IPhotos): void {
    const photosId = this.selectedPhotos.map(({ photoId }) => photoId);
    if (photosId.includes(photo._id)) {
      this.selectedPhotos = this.selectedPhotos.filter(({ photoId }) => photoId !== photo._id);
      return;
    }

    this.selectedPhotos.push({ photoId: photo._id, photoLink: photo.src, photoName: photo.name });
  }

  bulkDelete(): void {
    const photosId: string[] = this.selectedPhotos.map(({ photoId }) => photoId);
    this.http.patch(`${environment.baseUrl}/${ApiPaths.BulkDelete}`, { photosId })
      .subscribe(() => this.photosService.getPhotos());
    this.isSelect = false;
    this.selectedPhotos.length = 0;
  }

  bulkDownload(): void {
    this.selectedPhotos.forEach(({ photoLink, photoName }) => this.photoDownloading(photoLink, photoName));
    this.isSelect = false;
    this.selectedPhotos.length = 0;
  }

  download(photo: IPhotos): void {
    this.photoDownloading(photo.src, photo.name);
  }

  photoDownloading(link: string, name: string): void {
    const aTag = document.createElement('a');
    document.body.appendChild(aTag);
    aTag.href = link;
    aTag.download = name;
    aTag.click();
    aTag.remove();
  }
}
