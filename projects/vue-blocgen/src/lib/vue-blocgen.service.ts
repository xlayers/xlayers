import { Injectable } from "@angular/core";
import { VueContextService } from "./vue-context.service";
import { VueParserService } from "./vue-parser.service";
import { VueRenderService } from "./vue-render.service";

export interface VueBlocGenOptions {
  assetDir?: string;
  componentDir?: string;
}

@Injectable({
  providedIn: "root"
})
export class VueBlocGenService {
  constructor(
    private vueContextService: VueContextService,
    private vueParserService: VueParserService,
    private vueRenderService: VueRenderService
  ) {}

  transform(
    data: SketchMSData,
    current: SketchMSLayer,
    opts?: VueBlocGenOptions
  ) {
    if (!this.vueContextService.hasContext(current)) {
      this.vueParserService.compute(data, current);
    }

    return this.vueRenderService.render(data, current, opts);
  }
}
