import { NgModule } from '@angular/core';
import { BplistService } from './bplist.service';
import { FormatService } from './format.service';
import { ShapeService } from './shape.service';
import { StyleService } from './style.service';

@NgModule({
  providers: [BplistService, FormatService, ShapeService, StyleService]
})
export class SketchLibModule {}
