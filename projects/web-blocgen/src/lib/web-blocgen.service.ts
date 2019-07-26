import { Injectable } from "@angular/core";
import { WebContextService } from "./web-context.service";
import { WebParserService } from "./web-parser.service";
import { WebRenderService } from "./web-render.service";
import { VueRenderService } from "./vue-render.service";
import { AngularRenderService } from "./angular-render.service";
import { WebBlocGenOptions } from "./web-blocgen.d";

const DEFAULT_OPTIONS: WebBlocGenOptions = {
  mode: "web",
  xmlPrefix: "xly-",
  cssPrefix: "xly_",
  componentDir: "components",
  assetDir: "assets"
};

@Injectable({
  providedIn: "root"
})
export class WebBlocGenService {
  constructor(
    private webContext: WebContextService,
    private webParser: WebParserService,
    private webRender: WebRenderService,
    private vueRender: VueRenderService,
    private angularRender: AngularRenderService
  ) {}

  transform(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebBlocGenOptions
  ) {
    if (!this.webContext.hasContext(current)) {
      this.compute(current, data, options);
    }

    return this.render(current, data, options);
  }

  compute(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebBlocGenOptions
  ) {
    this.webParser.compute(current, data, {
      ...DEFAULT_OPTIONS,
      ...options
    });
  }

  render(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebBlocGenOptions
  ) {
    const defaultOptions = { ...DEFAULT_OPTIONS, ...options };

    switch (options.mode) {
      case "vue":
        return this.vueRender.render(current, data, defaultOptions);

      case "angular":
        return this.angularRender.render(current, data, defaultOptions);

      default:
        return this.webRender.render(current, data, defaultOptions);
    }
  }

  identify(current: SketchMSLayer) {
    return this.webContext.identify(current);
  }

  hasContext(current: SketchMSLayer) {
    return this.webContext.hasContext(current);
  }

  contextOf(current: SketchMSLayer) {
    return this.webContext.contextOf(current);
  }
}
