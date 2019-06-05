import { NgModule } from "@angular/core";
import { SketchIngestorService } from "./sketch-ingestor.service";

@NgModule({
  declarations: [SketchIngestorService],
  exports: [SketchIngestorService]
})
export class SketchBlocgenModule {}
