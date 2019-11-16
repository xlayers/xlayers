import { Injectable } from '@angular/core';
import { ImageService, SymbolService, LayerService } from '@xlayers/sketch-lib';
import { WebContextService } from './web-context.service';
import { WebParserService } from './web-parser.service';
import { WebAggregatorService } from './web-aggregator.service';
import { WebCodeGenOptions } from './web-codegen.d';

@Injectable({
  providedIn: 'root'
})
export class WebCodeGenService {
  constructor(
    private readonly symbolService: SymbolService,
    private readonly imageService: ImageService,
    private readonly webContext: WebContextService,
    private readonly webParser: WebParserService,
    private readonly webAggretatorService: WebAggregatorService,
    private readonly layerService: LayerService
  ) {}

  compute(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebCodeGenOptions
  ) {
    this.webParser.compute(current, data, this.compileOptions(options));
  }

  aggregate(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebCodeGenOptions
  ) {
    return this.visit(current, data, this.compileOptions(options));
  }

  identify(current: SketchMSLayer) {
    return this.webContext.identify(current);
  }

  context(current: SketchMSLayer) {
    return this.webContext.of(current);
  }

  private visit(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebCodeGenOptions
  ) {
    return this.visitContent(current, data, options).concat(
      this.webAggretatorService.aggregate(current, options)
    );
  }

  private visitContent(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebCodeGenOptions
  ) {
    if (this.layerService.identify(current)) {
      return this.visitLayer(current, data, options);
    } else if (this.symbolService.identify(current)) {
      return this.visitSymbolMaster(current, data, options);
    } else if (this.imageService.identify(current)) {
      return this.imageService.aggregate(current, data, options);
    }
    return [];
  }

  private visitLayer(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebCodeGenOptions
  ) {
    return this.layerService
      .lookup(current)
      .flatMap(layer => this.visitContent(layer, data, options));
  }

  private visitSymbolMaster(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebCodeGenOptions
  ) {
    const symbolMaster = this.symbolService.lookup(current, data);
    if (symbolMaster) {
      return this.visit(symbolMaster, data, options);
    }
    return [];
  }

  private compileOptions(options: WebCodeGenOptions) {
    return {
      textTagName: 'span',
      bitmapTagName: 'img',
      blockTagName: 'div',
      mode: 'web',
      jsx: false,
      xmlPrefix: 'xly-',
      cssPrefix: 'xly_',
      componentDir: 'components',
      assetDir: 'assets',
      ...options
    };
  }
}
