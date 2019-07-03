import { NgModule } from '@angular/core';
import { TextBlocGenService } from './text-blocgen.service';
import { StdBlocgenModule } from '@xlayers/std-blocgen';

@NgModule({
  imports: [StdBlocgenModule],
  providers: [TextBlocGenService]
})
export class TextBlocgenModule {}
