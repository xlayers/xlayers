import { NgModule } from '@angular/core';
import { XmlService } from './xml.service';
import { BplistService } from './bplist.service';
import { FormatService } from './format.service';
import { ShapeService } from './shape.service';
import { StyleService } from './style.service';

@NgModule({
  declarations: [
    XmlService,
    BplistService,
    FormatService,
    ShapeService,
    StyleService
  ],
  exports: [
    XmlService,
    BplistService,
    FormatService,
    ShapeService,
    StyleService
  ]
})
export class StdBlocgenModule {}
