import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ResizableModule } from 'angular-resizable-element';

import { ColorSketchModule } from 'ngx-color/sketch';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';

const MatModules = [
  MatSnackBarModule,
  MatExpansionModule,
  MatSlideToggleModule,
  MatListModule,
  MatSidenavModule,
  MatIconModule,
  MatButtonModule,
  MatToolbarModule,
  MatInputModule,
  ScrollDispatchModule,
  MatCardModule,
  MatTabsModule,
  MatButtonToggleModule,
  MatMenuModule
];

const ExtraModules = [ResizableModule, FormsModule, ColorSketchModule];

@NgModule({
  imports: [CommonModule, ...MatModules, ...ExtraModules],
  exports: [...MatModules, ...ExtraModules],
  declarations: []
})
export class CoreModule {}
