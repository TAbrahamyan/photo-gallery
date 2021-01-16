import { Pipe, PipeTransform } from '@angular/core';
import { IPhotos } from 'src/app/interfaces';

@Pipe({
  name: 'filter'
})
export class FilterDatesPipe implements PipeTransform {
  transform(photos: IPhotos[], date: string) {
    return photos.filter(({ createdAt }) => new Date(createdAt).toDateString() === date);
  }
}
