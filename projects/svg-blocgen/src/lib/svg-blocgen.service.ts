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

  transform(current: SketchMSLayer) {
    if (!this.svgContextService.hasContext(current)) {
      this.compute(current);
    }

    return this.render(current);
  }

  compute(current: SketchMSLayer) {
    this.svgParserService.compute(current);
  }

  render(current: SketchMSLayer) {
    return this.svgRenderService.render(current);
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
