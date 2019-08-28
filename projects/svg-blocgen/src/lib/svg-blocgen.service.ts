import { Injectable } from '@angular/core';
import { SvgContextService } from './svg-context.service';
import { SvgAggregatorService } from './svg-aggregator.service';
import { SvgParserService } from './svg-parser.service';
import { SvgBlocGenOptions } from './svg-blocgen';

@Injectable({
  providedIn: 'root'
})
export class SvgBlocGenService {
  constructor(
    private svgContext: SvgContextService,
    private svgParser: SvgParserService,
    private svgAggretatorService: SvgAggregatorService
  ) {}

  compute(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: SvgBlocGenOptions
  ) {
    this.svgParser.compute(current, data, this.compileOptions(options));
  }

  aggreate(current: SketchMSLayer, options?: SvgBlocGenOptions) {
    return this.svgAggretatorService.aggreate(
      current,
      this.compileOptions(options)
    );
  }

  identify(current: SketchMSLayer) {
    return this.svgContext.identify(current);
  }

  context(current: SketchMSLayer) {
    return this.svgContext.of(current);
  }

  private compileOptions(options: SvgBlocGenOptions) {
    return {
      xmlNamespace: true,
      ...options
    };
  }
}
