import { NgModule } from '@angular/core';
import { TextBlocGenService } from './text-blocgen.service';
import { TextContextService } from './text-context.service';
import { StdBlocgenModule } from '@xlayers/std-blocgen';

@NgModule({
  imports: [StdBlocgenModule],
  providers: [TextBlocGenService, TextContextService]
})
export class TextBlocgenModule {}
