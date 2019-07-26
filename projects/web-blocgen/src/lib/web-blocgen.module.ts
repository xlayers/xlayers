import { NgModule } from "@angular/core";
import { WebBlocGenService } from "./web-blocgen.service";
import { CssBlocDenModule } from "@xlayers/css-blocgen";
import { SketchUtilModule } from "@xlayers/sketch-lib";
import { SvgBlocDenModule } from "@xlayers/svg-blocgen";

@NgModule({
  imports: [CssBlocDenModule, SvgBlocDenModule, SketchUtilModule],
  providers: [WebBlocGenService]
})
export class WebBlocGenModule {}
