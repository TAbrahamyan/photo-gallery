import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { IFrontUser } from 'src/app/interfaces';
import { PhotoService } from '../../services/api/photo.service';
import { UserService } from '../../services/api/user.service';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [`
    button { margin: 0.5rem }
    .open-profile:hover { text-decoration: underline; cursor: pointer }
  `],
})
export class HeaderComponent implements OnInit {
  @ViewChild('uploadPhoto') uploadPhoto: ElementRef;

  constructor(
    private photoService: PhotoService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  get userData(): IFrontUser {
    return this.userService.userData;
  }

  ngOnInit(): void {
    this.userService.getUser();
  }

  chooseFile(): void {
    this.uploadPhoto.nativeElement.click();
  }

  clearFileInputValue(e) {
    e.target.value = '';
  }

  logout(): void {
    this.userService.logout();
  }

  openProfile(): void {
    this.dialog.open(ProfileDialogComponent, {
      width: '30%',
      panelClass: 'profile-dialog',
      backdropClass: 'profile-backdrop',
    });
  }

  uploadPhotoHandler({ target: { files } }): void {
    if (!files[0].type.match('image.*')) {
      this.snackBar.open('Please upload only images', 'Close', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      return;
    }

    if (files && files[0]) {
      const reader: FileReader = new FileReader();
      reader.onload = (): void => {
        this.photoService.uploadPhoto(reader.result, files[0].name);
      }
      reader.readAsDataURL(files[0]);
    }
  }
}
