import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IInputsConfig } from 'src/app/interfaces';
import { UserService } from '../../services/api/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../../../app.component.styl'],
})
export class SignupComponent {
  signupForm: FormGroup = new FormGroup({
    username: new FormControl('', [ Validators.required, ({ value }) => value.replace(/[\w-]+/g, '') ]),
    email: new FormControl('', [ Validators.required, Validators.email, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$') ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
    confirmPassword: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
  });

  constructor(private title: Title, public userService: UserService) {
    this.title.setTitle('Signup');
  }

  get inputsConfig(): IInputsConfig[] {
    return this.userService.inputsConfig;
  }

  signup() {
    const { password, confirmPassword } = this.signupForm.value;

    if (password !== confirmPassword) {
      return this.userService.snackBar('Password confirmation is incorrect');
    }

    this.userService.signup(this.signupForm.value);
  }
}
