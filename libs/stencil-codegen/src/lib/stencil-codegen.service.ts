import { Injectable } from '@angular/core';
import { ImageService, SymbolService, LayerService } from '@xlayers/sketch-lib';
import { WebCodeGenService } from '@xlayers/web-codegen';
import { StencilAggregatorService } from './stencil-aggregator.service';
import { SketchMSLayer, SketchMSData } from '@xlayers/sketchtypes';

type WebCodeGenOptions = any;

@Injectable({
  providedIn: 'root',
})
export class StencilCodeGenService {
  constructor(
    private readonly symbolService: SymbolService,
    private readonly imageService: ImageService,
    private readonly webCodeGen: WebCodeGenService,
    private readonly stencilAggretatorService: StencilAggregatorService,
    private readonly layerService: LayerService
  ) {}

  compute(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebCodeGenOptions
  ) {
    this.webCodeGen.compute(current, data, this.compileOptions(options));
  }

  aggregate(data: SketchMSData, options?: WebCodeGenOptions) {
    return data.pages.flatMap((page) =>
      this.visit(page, data, this.compileOptions(options))
    );
  }

  identify(current: SketchMSLayer) {
    return this.webCodeGen.identify(current);
  }

  context(current: SketchMSLayer) {
    return this.webCodeGen.context(current);
  }

  private visit(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebCodeGenOptions
  ) {
    return this.visitContent(current, data, options).concat(
      this.stencilAggretatorService.aggregate(current, data, options)
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
      .flatMap((layer) => this.visitContent(layer, data, options));
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
      xmlPrefix: 'xly-',
      cssPrefix: 'xly_',
      componentDir: 'components',
      assetDir: 'assets',
      ...options,
    };
  }
}
