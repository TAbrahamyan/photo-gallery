import { Component, OnInit } from '@angular/core';
import SwiperCore, { Navigation } from 'swiper/core';

import { IPhotos, IPhotosData, IPhotosConfig } from 'src/app/interfaces';
import { PhotoService } from '../../services/api/photo.service';

SwiperCore.use([ Navigation ]);

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.styl']
})
export class PhotosComponent implements OnInit {
  photosConfig: IPhotosConfig = { photoIndex: -1, isShowSlider: false, isSelect: false, selectedPhotos: [] };

  constructor(private photoService: PhotoService) { }

  get photosData(): IPhotosData {
    return this.photoService.photosData;
  }

  ngOnInit(): void {
    this.photoService.getPhotos();
  }

  formatUploadedDate(date: string): string | Date {
    const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const localeDate: number = new Date().getDate();
    const uploadedDate: Date = new Date(date);
    let result: string | Date = '';

    if (localeDate === uploadedDate.getDate()) {
      result = 'Today';
    } else if (localeDate - 1 === uploadedDate.getDate()) {
      result = 'Yesterday';
    } else {
      result = `${months[uploadedDate.getMonth()]} ${uploadedDate.getDate()}, ${uploadedDate.getFullYear()}`;
    }

    return result;
  }

  isShowSliderHandler(id: string): void {
    if (!this.photosConfig.isSelect) {
      this.photosConfig.photoIndex = this.photosData.photos.findIndex(({ _id }) => _id === id);
      this.photosConfig.isShowSlider = true;
    }
  }

  deletePhoto(id: string): void {
    this.photoService.deletePhoto(id);
  }

  selectPhoto(photo: IPhotos): void {
    const photosId = this.photosConfig.selectedPhotos.map(({ photoId }) => photoId);
    if (photosId.includes(photo._id)) {
      this.photosConfig.selectedPhotos = this.photosConfig.selectedPhotos.filter(({ photoId }) => photoId !== photo._id);
      return;
    }

    this.photosConfig.selectedPhotos.push({ photoId: photo._id, photoLink: photo.src, photoName: photo.name });
  }

  bulkDelete(): void {
    const photosId: string[] = this.photosConfig.selectedPhotos.map(({ photoId }) => photoId);
    this.photoService.bulkDelete(photosId);
    this.photosConfig.isSelect = false;
    this.photosConfig.selectedPhotos.length = 0;
  }

  bulkDownload(): void {
    this.photosConfig.selectedPhotos.forEach(({ photoLink, photoName }) => this.photoDownloading(photoLink, photoName));
    this.photosConfig.isSelect = false;
    this.photosConfig.selectedPhotos.length = 0;
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
