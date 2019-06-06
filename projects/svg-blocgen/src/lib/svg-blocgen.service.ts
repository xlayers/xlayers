import { Injectable } from '@angular/core';
import { SvgContextService } from './svg-context.service';
import { SvgRenderService } from './svg-render.service';
import { SvgParserService } from './svg-parser.service';

@Injectable({
  providedIn: 'root'
})
export class SvgBlocGenService {
  constructor(
    private svgContextService: SvgContextService,
    private svgParserService: SvgParserService,
    private svgRenderService: SvgRenderService
  ) {}

  transform(current: SketchMSLayer, data?: SketchMSData) {
    if (!this.svgContextService.hasContext(current)) {
      this.svgParserService.compute(current);
    }

    return this.svgRenderService.render(current, data);
  }
}
