import { Injectable } from '@angular/core';
import { CssContextService } from './css-context.service';
import { CssParserService } from './css-parser.service';
import { CssAggregatorService } from './css-aggregator.service';
import { CssCodeGenOptions } from './css-codegen';

@Injectable({
  providedIn: 'root'
})
export class CssCodeGenService {
  constructor(
    private cssContext: CssContextService,
    private cssParser: CssParserService,
    private cssAggretatorService: CssAggregatorService
  ) {}

  compute(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: CssCodeGenOptions
  ) {
    this.cssParser.compute(current, data, this.compileOptions(options));
  }

  aggreate(current: SketchMSLayer, options?: CssCodeGenOptions) {
    return this.cssAggretatorService.aggreate(
      current,
      this.compileOptions(options)
    );
  }

  identify(current: SketchMSLayer) {
    return this.cssContext.identify(current);
  }

  context(current: SketchMSLayer) {
    return this.cssContext.of(current);
  }

  private compileOptions(options: CssCodeGenOptions) {
    return {
      generateClassName: true,
      cssPrefix: 'xly_',
      componentDir: 'components',
      ...options
    };
  }
}
