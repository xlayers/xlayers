import { Injectable } from "@angular/core";
import { SvgContextService } from "./svg-context.service";
import { SvgRenderService } from "./svg-render.service";
import { SvgParserService } from "./svg-parser.service";

const DEFAULT_OPTIONS = { xmlNamespace: true };

export interface SvgBlocGenOptions {
  xmlNamespace: boolean;
}

@Injectable({
  providedIn: "root"
})
export class SvgBlocGenService {
  constructor(
    private svgContext: SvgContextService,
    private svgParser: SvgParserService,
    private svgRenderService: SvgRenderService
  ) {}

  transform(current: SketchMSLayer, options?: SvgBlocGenOptions) {
    if (!this.svgContext.hasContext(current)) {
      this.compute(current);
    }

    return this.render(current, options);
  }

  compute(current: SketchMSLayer) {
    this.svgParser.compute(current);
  }

  render(current: SketchMSLayer, options: SvgBlocGenOptions = DEFAULT_OPTIONS) {
    return this.svgRenderService.render(current, options);
  }

  identify(current: SketchMSLayer) {
    return this.svgContext.identify(current);
  }

  hasContext(current: SketchMSLayer) {
    return this.svgContext.hasContext(current);
  }

  contextOf(current: SketchMSLayer) {
    return this.svgContext.contextOf(current);
  }
}
