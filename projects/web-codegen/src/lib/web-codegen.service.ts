import { Injectable } from '@angular/core';
import { ImageService, SymbolService, LayerService } from '@xlayers/sketch-lib';
import { WebContextService } from './web-context.service';
import { WebParserService } from './web-parser.service';
import { WebAggregatorService } from './web-aggregator.service';
import { VueAggregatorService } from './vue-aggregator.service';
import { AngularAggregatorService } from './angular-aggregator.service';
import { AngularElementAggregatorService } from './angular-element-aggregator.service';
import { ReactAggregatorService } from './react-aggregator.service';
import { LitElementAggregatorService } from './lit-element-aggregator.service';
import { WebCodeGenOptions } from './web-codegen.d';
import { StencilAggregatorService } from './stencil-aggregator.service';
import { WebComponentAggregatorService } from './web-component-render.service';

@Injectable({
  providedIn: 'root'
})
export class WebCodeGenService {
  constructor(
    private readonly symbolService: SymbolService,
    private readonly imageService: ImageService,
    private readonly webContext: WebContextService,
    private readonly webParser: WebParserService,
    private readonly webComponentAggretatorService: WebComponentAggregatorService,
    private readonly vueAggretatorService: VueAggregatorService,
    private readonly angularAggretatorService: AngularAggregatorService,
    private readonly angularElementAggretatorService: AngularElementAggregatorService,
    private readonly litElementAggretatorService: LitElementAggregatorService,
    private readonly reactAggretatorService: ReactAggregatorService,
    private readonly stencilAggretatorService: StencilAggregatorService,
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

  aggreate(
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
    switch (options.mode) {
      case 'vue':
        return this.visitContent(current, data, options).concat(
          this.vueAggretatorService.aggreate(current, options)
        );

      case 'angular':
        return this.visitContent(current, data, options).concat(
          this.angularAggretatorService.aggreate(current, options)
        );

      case 'angularElement':
        return this.visitContent(current, data, options).concat(
          this.angularElementAggretatorService.aggreate(current, options)
        );

      case 'litElement':
        return this.visitContent(current, data, options).concat(
          this.litElementAggretatorService.aggreate(current, options)
        );

      case 'react':
        return this.visitContent(current, data, options).concat(
          this.reactAggretatorService.aggreate(current, {
            ...options,
            jsx: true
          })
        );

      case 'webComponent':
        return this.visitContent(current, data, options).concat(
          this.webComponentAggretatorService.aggreate(current, options)
        );

      case 'stencil':
        return this.visitContent(current, data, options).concat(
          this.stencilAggretatorService.aggreate(current, {
            ...options,
            jsx: true
          })
        );

      default:
        return this.visitContent(current, data, options).concat(
          this.webAggretatorService.aggreate(current, options)
        );
    }
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
      return this.imageService.aggreate(current, data, options);
    }
    return [];
  }

  private visitLayer(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebCodeGenOptions
  ) {
    return this.layerService
      .lookup(current, data)
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
