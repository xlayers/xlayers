import { NgModule } from '@angular/core';
import { VueBlocGenService } from './vue-blocgen.service';
import { TextBlocgenModule } from '@xlayers/text-blocgen';
import { BitmapBlocgenModule } from '@xlayers/bitmap-blocgen';
import { CssBlocgenModule } from '@xlayers/css-blocgen';
import { StdLibraryModule } from '@xlayers/std-library';
import { SvgBlocgenModule } from '@xlayers/svg-blocgen';

@NgModule({
  imports: [
    CssBlocgenModule,
    SvgBlocgenModule,
    StdLibraryModule,
    BitmapBlocgenModule,
    TextBlocgenModule
  ],
  providers: [VueBlocGenService]
})
export class VueBlocgenModule {}
