import { NgModule } from '@angular/core';
import { BinaryPropertyListParserService } from './bplist-parser.service';
import { SketchStyleParserService } from './sketch-style-parser.service';

@NgModule({
  providers: [SketchStyleParserService, BinaryPropertyListParserService]
})
export class SketchParserModule {}
