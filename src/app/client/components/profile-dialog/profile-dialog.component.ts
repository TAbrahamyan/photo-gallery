import { Component } from '@angular/core';
import { IFrontUser } from 'src/app/interfaces';
import { UserService } from '../../services/api/user.service';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html'
})
export class ProfileDialogComponent {
  isEdit: boolean = false;
  newUsername: string = '';

  constructor(private userService: UserService) { }

  get userData(): IFrontUser {
    return this.userService.userData;
  }

  deleteAccount(): void {
    this.userService.deleteAccount();
  }

  editUsernameHandler(): void {
    if (
      !this.newUsername.trim()
      || this.newUsername.length < 3
      || this.newUsername.length > 20
      || this.newUsername.match(/[^\w -]+/g)
    ) {
      return this.userService.snackBar('Word range 3-20 and must not contain special symbols.');
    }

    this.userService.editUsername(this.newUsername);
    this.isEdit = false;
  }

  isEditHandler(): void {
    this.newUsername = this.userData.username;
    this.isEdit = true;
  }
}
