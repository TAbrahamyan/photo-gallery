import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IPhotos } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {
  photos: IPhotos[] = [];
  isLoading: boolean = false;

  constructor(private _snackBar: MatSnackBar) { }

  snackBar(message: string): void {
    this._snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
