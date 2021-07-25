import { Injectable } from '@angular/core';
import { ImageService, LayerService, SymbolService } from '@xlayers/sketch-lib';
import { SketchMSData, SketchMSLayer } from '@xlayers/sketchtypes';
import { SvelteAggregatorService } from './svelte-aggregator.service';

type WebCodeGenOptions = any;

@Injectable({
  providedIn: 'root',
})
export class SvelteCodegenService {
  constructor(
    private readonly svelteAggregatorService: SvelteAggregatorService,
    private readonly layerService: LayerService,
    private readonly symbolService: SymbolService,
    private readonly imageService: ImageService
  ) {}

  aggregate(data: SketchMSData, options?: WebCodeGenOptions) {
    return data.pages.flatMap((page) =>
      this.visit(page, data, this.compileOptions(options))
    );
  }

  private visit(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebCodeGenOptions
  ) {
    return this.visitContent(current, data, options).concat(
      this.svelteAggregatorService.aggregate(current, data, options)
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
