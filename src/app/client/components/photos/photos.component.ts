import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import SwiperCore, { Navigation } from 'swiper/core';

import { IPhotos, ISelectedPhotos } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';
import { ApiPaths } from '../../enums/ApiPaths';
import { HomeService } from '../../services/home.service';

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
    return this.homeService.photos;
  }

  get photosDate(): string[] {
    return this.homeService.photosDate;
  }

  get isLoading(): boolean {
    return this.homeService.isLoading;
  }

  constructor(
    private http: HttpClient,
    private homeService: HomeService,
  ) { }

  ngOnInit(): void {
    this.homeService.getPhotos();
  }

  formatUploadedDate(date: string): string | Date {
    const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const localeDate: Date = new Date();
    const uploadedDate: Date = new Date(date);
    let result: string | Date = '';

    if (localeDate.getDate() === uploadedDate.getDate()) {
      result = 'Today';
    } else if (localeDate.getDate() - 1 === uploadedDate.getDate()) {
      result = 'Yesterday';
    } else {
      result = `${months[uploadedDate.getMonth()]} ${uploadedDate.getDate()}, ${uploadedDate.getFullYear()}`;
    }

    return result;
  }

  isShowSliderHandler(id: string): void {
    if (!this.isSelect) {
      this.photoIndex = this.photos.findIndex((photo: IPhotos) => photo._id === id);
      this.isShowSlider = true;
    }
  }

  deletePhoto(id: string): void {
    this.http.delete<IPhotos>(`${environment.baseUrl}/${ApiPaths.DeletePhoto}/${id}`)
      .subscribe(() => this.homeService.getPhotos());
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
      .subscribe(() => this.homeService.getPhotos());
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
