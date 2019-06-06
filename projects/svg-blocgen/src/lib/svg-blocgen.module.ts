import { NgModule } from '@angular/core';
import { SvgBlocGenService } from './svg-blocgen.service';
import { SvgContextService } from './svg-context.service';

@NgModule({
  declarations: [SvgBlocGenService, SvgContextService],
  exports: [SvgBlocGenService, SvgContextService]
})
export class SvgBlocgenModule {}
