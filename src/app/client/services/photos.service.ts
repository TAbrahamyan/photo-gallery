import { Injectable } from '@angular/core';
import { IPhotos } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {
  photos: IPhotos[] = [];
  isLoading: boolean = false;
}
