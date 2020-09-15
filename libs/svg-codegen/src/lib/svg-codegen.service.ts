import { Injectable } from '@angular/core';
import { SvgContextService } from './svg-context.service';
import { SvgAggregatorService } from './svg-aggregator.service';
import { SvgParserService } from './svg-parser.service';
import { SvgCodeGenOptions } from './svg-codegen';
import { SketchMSLayer, SketchMSData } from '@xlayers/sketchtypes';

@Injectable({
  providedIn: 'root',
})
export class SvgCodeGenService {
  constructor(
    private svgContext: SvgContextService,
    private svgParser: SvgParserService,
    private svgAggretatorService: SvgAggregatorService
  ) {}

  compute(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: SvgCodeGenOptions
  ) {
    this.svgParser.compute(current, data, this.compileOptions(options));
  }

  aggregate(current: SketchMSLayer, options?: SvgCodeGenOptions) {
    return this.svgAggretatorService.aggregate(
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

  private compileOptions(options: SvgCodeGenOptions) {
    return {
      xmlNamespace: true,
      ...options,
    };
  }
}
