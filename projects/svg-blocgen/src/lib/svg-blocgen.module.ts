import { NgModule } from '@angular/core';
import { SvgBlocGenService } from './svg-blocgen.service';
import { SketchUtilModule } from '@xlayers/sketch-util';

@NgModule({
  imports: [SketchUtilModule],
  providers: [SvgBlocGenService]
})
export class SvgBlocgenModule {}
