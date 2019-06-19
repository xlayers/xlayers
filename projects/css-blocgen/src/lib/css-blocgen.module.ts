import { NgModule } from '@angular/core';
import { CssBlocGenService } from './css-blocgen.service';
import { CssContextService } from './css-context.service';
import { StdBlocgenModule } from '@xlayers/std-blocgen';

@NgModule({
  imports: [StdBlocgenModule],
  providers: [CssBlocGenService, CssContextService]
})
export class CssBlocgenModule {}
