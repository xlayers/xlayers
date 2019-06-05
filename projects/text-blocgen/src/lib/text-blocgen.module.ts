import { NgModule } from "@angular/core";
import { TextBlocGenService } from "./text-blocgen.service";
import { TextContextService } from "./text-context.service";

@NgModule({
  declarations: [TextBlocGenService, TextContextService],
  exports: [TextBlocGenService, TextContextService]
})
export class TextBlocgenModule {}
