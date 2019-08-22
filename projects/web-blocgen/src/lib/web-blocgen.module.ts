import { NgModule } from '@angular/core';
import { CssBlocGenModule } from '@xlayers/css-blocgen';
import { SketchLibModule } from '@xlayers/sketch-lib';
import { SvgBlocGenModule } from '@xlayers/svg-blocgen';

@NgModule({
  imports: [CssBlocGenModule, SvgBlocGenModule, SketchLibModule]
})
export class WebBlocGenModule {}
