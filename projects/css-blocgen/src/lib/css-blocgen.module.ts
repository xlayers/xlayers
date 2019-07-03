import { NgModule } from '@angular/core';
import { CssBlocGenService } from './css-blocgen.service';
import { StdLibraryModule } from '@xlayers/std-library';

@NgModule({
  imports: [StdLibraryModule],
  providers: [CssBlocGenService]
})
export class CssBlocgenModule {}
