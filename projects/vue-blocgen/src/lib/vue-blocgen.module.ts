import { NgModule } from '@angular/core';
import { VueBlocGenService } from './vue-blocgen.service';
import { CssBlocgenModule } from '@xlayers/css-blocgen';
import { StdLibraryModule } from '@xlayers/std-library';
import { SvgBlocgenModule } from '@xlayers/svg-blocgen';

@NgModule({
  imports: [CssBlocgenModule, SvgBlocgenModule, StdLibraryModule],
  providers: [VueBlocGenService]
})
export class VueBlocgenModule {}
