import { Injectable } from "@angular/core";
import { VueContextService } from "./vue-context.service";
import { VueParserService } from "./vue-parser.service";
import { VueRenderService } from "./vue-render.service";

const DEFAULT_OPTIONS: VueBlocGenOptions = {
  prefix: "xly_",
  componentDir: "components",
  assetDir: "assets"
};

export interface VueBlocGenOptions {
  prefix?: string;
  componentDir?: string;
  assetDir?: string;
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
    current: SketchMSLayer,
    data: SketchMSData,
    options?: VueBlocGenOptions
  ) {
    if (!this.vueContextService.hasContext(current)) {
      this.compute(data, current, options);
    }

    return this.render(current, data, options);
  }

  compute(
    data: SketchMSData,
    current: SketchMSLayer,
    options: VueBlocGenOptions = DEFAULT_OPTIONS
  ) {
    this.vueParserService.compute(data, current, options);
  }

  render(
    current: SketchMSLayer,
    data: SketchMSData,
    options: VueBlocGenOptions = DEFAULT_OPTIONS
  ) {
    return this.vueRenderService.render(current, data, options);
  }

  identify(current: SketchMSLayer) {
    return this.vueContextService.identify(current);
  }

  hasContext(current: SketchMSLayer) {
    return this.vueContextService.hasContext(current);
  }

  contextOf(current: SketchMSLayer) {
    return this.vueContextService.contextOf(current);
  }
}
