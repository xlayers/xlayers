import { Injectable } from "@angular/core";
import { SvgContextService } from "./svg-context.service";
import { SvgRenderService } from "./svg-render.service";
import { SvgParserService } from "./svg-parser.service";

export interface SvgParserOptions {}

export interface SvgBlocGenContext {
  paths: string;
  offset: number;
}

@Injectable({
  providedIn: "root"
})
export class SvgBlocGenService {
  constructor(
    private readonly svgContextService: SvgContextService,
    private readonly svgParserService: SvgParserService,
    private readonly svgRenderService: SvgRenderService
  ) {}

  transform(
    data: SketchMSData,
    current: SketchMSLayer,
    options?: SvgParserOptions
  ) {
    if (!this.svgContextService.hasContext(current)) {
      this.svgParserService.compute(current);
    }

    return this.svgRenderService.render(data, current, options);
  }
}
