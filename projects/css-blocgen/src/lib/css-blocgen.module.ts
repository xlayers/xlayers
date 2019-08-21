import { NgModule } from '@angular/core';
import { CssBlocGenService } from './css-blocgen.service';
import { SketchLibModule } from '@xlayers/sketch-lib';

@NgModule({
  imports: [SketchLibModule],
  providers: [CssBlocGenService]
})
export class CssBlocDenModule {}
