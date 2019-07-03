import { NgModule } from '@angular/core';
import { TextBlocGenService } from './text-blocgen.service';
import { StdLibraryModule } from '@xlayers/std-library';

@NgModule({
  imports: [StdLibraryModule],
  providers: [TextBlocGenService]
})
export class TextBlocgenModule {}
