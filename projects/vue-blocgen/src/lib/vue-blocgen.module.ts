import { NgModule } from '@angular/core';
import { VueBlocGenService } from './vue-blocgen.service';
import { CssBlocgenModule } from '@xlayers/css-blocgen';
import { SketchUtilModule } from '@xlayers/sketch-util';
import { SvgBlocgenModule } from '@xlayers/svg-blocgen';

@NgModule({
  imports: [CssBlocgenModule, SvgBlocgenModule, SketchUtilModule],
  providers: [VueBlocGenService]
})
export class VueBlocgenModule {}
