import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  exports: [
    MatButtonModule,
    MatInputModule,
  ],
})
export class MaterialModule { }
