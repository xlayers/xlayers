import { NgModule } from '@angular/core';
import { WebBlocGenService } from './web-blocgen.service';
import { CssBlocGenModule } from '@xlayers/css-blocgen';
import { SketchLibModule } from '@xlayers/sketch-lib';
import { SvgBlocGenModule } from '@xlayers/svg-blocgen';

@NgModule({
  imports: [CssBlocGenModule, SvgBlocGenModule, SketchLibModule],
  providers: [WebBlocGenService]
})
export class WebBlocGenModule {}
