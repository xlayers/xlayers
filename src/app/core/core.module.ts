import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { ResizableModule } from 'angular-resizable-element';
import { ColorSketchModule } from 'ngx-color/sketch';

const MatModules = [
  MatTreeModule,
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
