import { Component } from '@angular/core';
import { IFrontUser } from 'src/app/interfaces';
import { UserService } from '../../services/api/user.service';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html'
})
export class ProfileDialogComponent {
  isEdit: boolean = false;
  inputVal: string = '';

  constructor(private userService: UserService) { }

  get userData(): IFrontUser {
    return this.userService.userData;
  }

  deleteAccount(): void {
    this.userService.deleteAccount();
  }

  editUsernameHandler(): void {
    if (!this.inputVal) {
      return this.userService.snackBar('Input can not be empty');
    }

    this.userService.editUsername(this.inputVal);
    this.isEdit = false;
  }

  isEditHandler(): void {
    this.inputVal = this.userData.username;
    this.isEdit = true;
  }
}
