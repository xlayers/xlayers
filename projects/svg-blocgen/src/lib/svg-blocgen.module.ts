import { NgModule } from '@angular/core';
import { SvgBlocGenService } from './svg-blocgen.service';
import { SketchLibModule } from '@xlayers/sketch-lib';

@NgModule({
  imports: [SketchLibModule],
  providers: [SvgBlocGenService]
})
export class SvgBlocDenModule {}
