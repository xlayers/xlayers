import { Injectable } from '@angular/core';
import { SvgContextService } from './svg-context.service';
import { SvgRenderService } from './svg-render.service';
import { SvgParserService } from './svg-parser.service';
import { SvgBlocGenOptions } from './svg-blocgen';
import { SketchMSData } from '../../../../src/app/core/sketch.service';

@Injectable({
  providedIn: 'root'
})
export class SvgBlocGenService {
  constructor(
    private svgContext: SvgContextService,
    private svgParser: SvgParserService,
    private svgRender: SvgRenderService
  ) {}

  compute(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: SvgBlocGenOptions
  ) {
    this.svgParser.compute(current, data, this.compileOptions(options));
  }

  render(current: SketchMSLayer, options?: SvgBlocGenOptions) {
    return this.svgRender.render(current, this.compileOptions(options));
  }

  identify(current: SketchMSLayer) {
    return this.svgContext.identify(current);
  }

  context(current: SketchMSLayer) {
    return this.svgContext.contextOf(current);
  }

  private compileOptions(options: SvgBlocGenOptions) {
    return {
      xmlNamespace: true,
      ...options
    };
  }
}
