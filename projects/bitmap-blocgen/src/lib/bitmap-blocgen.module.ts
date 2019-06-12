import { NgModule } from '@angular/core';
import { BitmapBlocGenService } from './bitmap-blocgen.service';
import { BitmapContextService } from './bitmap-context.service';

@NgModule({
  providers: [BitmapBlocGenService, BitmapContextService]
})
export class BitmapBlocgenModule {}
