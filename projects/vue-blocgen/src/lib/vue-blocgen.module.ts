import { NgModule } from '@angular/core';
import { VueBlocGenService } from './vue-blocgen.service';
import { VueContextService } from './vue-context.service';
import { TextBlocgenModule } from 'text-blocgen';
import { BitmapBlocgenModule } from 'bitmap-blocgen';
import { CssBlocgenModule } from 'css-blocgen';
import { StdBlocgenModule } from 'std-blocgen';
import { SvgBlocgenModule } from 'svg-blocgen';

@NgModule({
  imports: [
    CssBlocgenModule,
    SvgBlocgenModule,
    StdBlocgenModule,
    BitmapBlocgenModule,
    TextBlocgenModule
  ],
  providers: [VueBlocGenService, VueContextService]
})
export class VueBlocgenModule {}
