import { NgModule } from '@angular/core';
import { CssBlocGenService } from './css-blocgen.service';
import { SketchUtilModule } from '@xlayers/sketch-lib';

@NgModule({
  imports: [SketchUtilModule],
  providers: [CssBlocGenService]
})
export class CssBlocDenModule {}
