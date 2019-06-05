import { NgModule } from "@angular/core";
import { VueBlocGenService } from "./vue-blocgen.service";
import { VueContextService } from "./vue-context.service";

@NgModule({
  declarations: [VueBlocGenService, VueContextService],
  exports: [VueBlocGenService, VueContextService]
})
export class VueBlocgenModule {}
