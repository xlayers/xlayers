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
      this.compute(current);
    }

    return this.render(current, data);
  }

  compute(current: SketchMSLayer) {
    this.svgParserService.compute(current);
  }

  render(current: SketchMSLayer, data?: SketchMSData) {
    return this.svgRenderService.render(current, data);
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
