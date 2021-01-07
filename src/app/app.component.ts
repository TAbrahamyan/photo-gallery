import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent {
  constructor(
    public router: Router,
    private _snackBar: MatSnackBar,
  ) { }

  snackBar(message: string): void {
    this._snackBar.open(message, 'Close', {
      duration: 10000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
