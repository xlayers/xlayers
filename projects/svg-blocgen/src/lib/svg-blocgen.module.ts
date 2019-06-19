import { NgModule } from '@angular/core';
import { SvgBlocGenService } from './svg-blocgen.service';
import { SvgContextService } from './svg-context.service';
  import { StdBlocgenModule } from '@xlayers/std-blocgen';

@NgModule({
  imports: [StdBlocgenModule],
  providers: [SvgBlocGenService, SvgContextService]
})
export class SvgBlocgenModule {}
