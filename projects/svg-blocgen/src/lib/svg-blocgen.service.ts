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
    private svgContextService: SvgContextService,
    private svgParserService: SvgParserService,
    private svgRenderService: SvgRenderService
  ) {}

  transform(current: SketchMSLayer, options?: SvgBlocGenOptions) {
    if (!this.svgContextService.hasContext(current)) {
      this.compute(current);
    }

    return this.render(current, options);
  }

  compute(current: SketchMSLayer) {
    this.svgParserService.compute(current);
  }

  render(current: SketchMSLayer, options: SvgBlocGenOptions = DEFAULT_OPTIONS) {
    return this.svgRenderService.render(current, options);
  }

  identify(current: SketchMSLayer) {
    return this.svgContextService.identify(current);
  }

  hasContext(current: SketchMSLayer) {
    return this.svgContextService.hasContext(current);
  }

  contextOf(current: SketchMSLayer) {
    return this.svgContextService.contextOf(current);
  }
}
