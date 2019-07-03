import { NgModule } from '@angular/core';
import { SvgBlocGenService } from './svg-blocgen.service';
import { StdBlocgenModule } from '@xlayers/std-blocgen';

@NgModule({
  imports: [StdBlocgenModule],
  providers: [SvgBlocGenService]
})
export class SvgBlocgenModule {}
