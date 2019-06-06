import { Injectable } from '@angular/core';
import { SvgContextService } from './svg-context.service';
import { SvgRenderService } from './svg-render.service';
import { SvgParserService } from './svg-parser.service';

export interface SvgBlocGenOptions {}

@Injectable({
  providedIn: 'root'
})
export class SvgBlocGenService {
  constructor(
    private svgContextService: SvgContextService,
    private svgParserService: SvgParserService,
    private svgRenderService: SvgRenderService
  ) {}

  transform(
    data: SketchMSData,
    current: SketchMSLayer,
    opts?: SvgBlocGenOptions
  ) {
    if (!this.svgContextService.hasContext(current)) {
      this.svgParserService.compute(current);
    }

    return this.svgRenderService.render(data, current, opts);
  }
}
