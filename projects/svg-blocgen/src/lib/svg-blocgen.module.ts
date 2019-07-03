import { NgModule } from '@angular/core';
import { SvgBlocGenService } from './svg-blocgen.service';
import { StdLibraryModule } from '@xlayers/std-library';

@NgModule({
  imports: [StdLibraryModule],
  providers: [SvgBlocGenService]
})
export class SvgBlocgenModule {}
