import bugsnag from '@bugsnag/js';
import { BugsnagErrorHandler } from '@bugsnag/plugin-angular';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ColorSketchModule } from 'ngx-color/sketch';

const MatModules = [
  MatSliderModule,
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
  ScrollingModule,
  MatCardModule,
  MatTabsModule,
  MatButtonToggleModule,
  MatMenuModule,
  MatTooltipModule,
  MatSelectModule,
  DragDropModule
];

const ExtraModules = [FormsModule, ColorSketchModule];

const bugsnagClient = bugsnag('74a971bd894eea48c5d692078e969c39');

export function errorHandlerFactory() {
  return new BugsnagErrorHandler(bugsnagClient);
}

@NgModule({
  imports: [...MatModules, ...ExtraModules],
  exports: [CommonModule, ...MatModules, ...ExtraModules],
  providers: [ { provide: ErrorHandler, useFactory: errorHandlerFactory } ]
})
export class CoreModule {}
