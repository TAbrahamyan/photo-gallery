import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IInputsConfig } from 'src/app/interfaces';
import { UserService } from '../../services/api/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../../app.component.styl'],
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.email, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$') ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
  });

  constructor(private title: Title, public userService: UserService) {
    this.title.setTitle('Login');
  }

  get inputsConfig(): IInputsConfig[] {
    return this.userService.inputsConfig;
  }

  login(): void {
    this.userService.login(this.loginForm.value);
  }
}
