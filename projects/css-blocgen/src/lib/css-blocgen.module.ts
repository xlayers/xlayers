import { NgModule } from '@angular/core';
import { CssBlocGenService } from './css-blocgen.service';
import { CssContextService } from './css-context.service';

@NgModule({
  declarations: [CssBlocGenService, CssContextService],
  exports: [CssBlocGenService, CssContextService]
})
export class CssBlocgenModule {}
