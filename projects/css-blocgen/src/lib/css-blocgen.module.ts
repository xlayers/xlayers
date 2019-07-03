import { NgModule } from '@angular/core';
import { CssBlocGenService } from './css-blocgen.service';
import { StdBlocgenModule } from '@xlayers/std-blocgen';

@NgModule({
  imports: [StdBlocgenModule],
  providers: [CssBlocGenService]
})
export class CssBlocgenModule {}
