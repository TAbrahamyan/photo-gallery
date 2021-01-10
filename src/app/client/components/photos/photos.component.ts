import { Component } from '@angular/core';
import SwiperCore, { Navigation } from 'swiper/core';

SwiperCore.use([Navigation]);

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.styl']
})
export class PhotosComponent {
  photos: any = [
    'https://images.unsplash.com/photo-1610029795220-e5afca4dc7ba?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    'https://images.unsplash.com/photo-1609986826541-063f1aa74219?ixid=MXwxMjA3fDB8MHx0b3BpYy1mZWVkfDR8NnNNVmpUTFNrZVF8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1609952048180-7b35ea6b083b?ixid=MXwxMjA3fDB8MHx0b3BpYy1mZWVkfDEwfDZzTVZqVExTa2VRfHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1511719218143-933ef7b27efa?ixid=MXwxMjA3fDB8MHx0b3BpYy1mZWVkfDE3fDZzTVZqVExTa2VRfHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1609787871328-ffcdbbb56d94?ixid=MXwxMjA3fDB8MHx0b3BpYy1mZWVkfDU0fDZzTVZqVExTa2VRfHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  ];
  imageIndex: number = -1;
  isZoom: boolean = false;

  zoomPhotos(index: number): void {
    this.imageIndex = index;
    this.isZoom = true;
  }

  close(): void {
    this.isZoom = false;
  }
}
