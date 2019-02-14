import { AngularSketchModule } from './lib/sketch.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    AngularSketchModule
  ],
  declarations: []
})
export class ViewerModule { }
