import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
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
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { ColorSketchModule } from 'ngx-color/sketch';
import { SketchService } from './sketch.service';
import { WINDOW_PROVIDERS } from './window.service';

const MATERIAL = [
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

const PROVIDERS = [...WINDOW_PROVIDERS, SketchService];

const ExtraModules = [FormsModule, ColorSketchModule];

@NgModule({
  imports: [...MATERIAL, ...ExtraModules],
  exports: [CommonModule, ...MATERIAL, ...ExtraModules],
  providers: [...PROVIDERS]
})
export class CoreModule {}
