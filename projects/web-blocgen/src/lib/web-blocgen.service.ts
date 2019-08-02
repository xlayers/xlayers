import { Injectable } from '@angular/core';
import {
  FormatService,
  ImageService,
  SymbolService
} from '@xlayers/sketch-lib';
import { WebContextService } from './web-context.service';
import { WebParserService } from './web-parser.service';
import { WebRenderService } from './web-render.service';
import { VueRenderService } from './vue-render.service';
import { AngularRenderService } from './angular-render.service';
import { ReactRenderService } from './react-render.service';
import { LitElementRenderService } from './lit-element-render.service';
import { WebBlocGenOptions } from './web-blocgen.d';
import { StencilRenderService } from './stencil-render.service';
import { WebComponentRenderService } from './web-component-render.service';

@Injectable({
  providedIn: 'root'
})
export class WebBlocGenService {
  constructor(
    private symbol: SymbolService,
    private image: ImageService,
    private format: FormatService,
    private webContext: WebContextService,
    private webParser: WebParserService,
    private webComponentRender: WebComponentRenderService,
    private vueRender: VueRenderService,
    private angularRender: AngularRenderService,
    private litElementRender: LitElementRenderService,
    private reactRender: ReactRenderService,
    private stencilRender: StencilRenderService,
    private webRender: WebRenderService
  ) {}

  compute(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebBlocGenOptions
  ) {
    return this.webParser.compute(current, data, this.compileOptions(options));
  }

  render(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebBlocGenOptions
  ) {
    return this.traverseAndRender(current, data, this.compileOptions(options));
  }

  identify(current: SketchMSLayer) {
    return this.webContext.identify(current);
  }

  context(current: SketchMSLayer) {
    return this.webContext.contextOf(current);
  }

  private traverseAndRender(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebBlocGenOptions
  ) {
    switch (options.mode) {
      case 'vue':
        return [
          ...this.traverse(current, data, options),
          ...this.vueRender.render(current, options)
        ];

      case 'angular':
        return [
          ...this.traverse(current, data, options),
          ...this.angularRender.render(current, options)
        ];

      case 'litElement':
        return [
          ...this.traverse(current, data, options),
          ...this.litElementRender.render(current, options)
        ];

      case 'react':
        return [
          ...this.traverse(current, data, options),
          ...this.reactRender.render(current, options)
        ];

      case 'webComponent':
        return [
          ...this.traverse(current, data, options),
          ...this.webComponentRender.render(current, options)
        ];

      case 'stencil':
        return [
          ...this.traverse(current, data, options),
          ...this.stencilRender.render(current, options)
        ];

      default:
        return this.webRender.render(current, options);
    }
  }

  private traverse(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    if (current.layers && Array.isArray(current.layers)) {
      return (current.layers as any).flatMap(layer =>
        this.traverse(layer, data, options)
      );
    }
    return this.retrieveFiles(data, current, options);
  }

  private retrieveFiles(
    data: SketchMSData,
    current: SketchMSLayer,
    options: WebBlocGenOptions
  ) {
    if (this.symbol.identify(current)) {
      return this.retrieveSymbolMaster(current, data, options);
    }
    if (this.image.identify(current)) {
      return this.retrieveBitmap(current, data, options);
    }
    return [];
  }

  private retrieveSymbolMaster(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    const symbolMaster = this.symbol.lookup(current, data);

    if (symbolMaster) {
      return this.traverseAndRender(symbolMaster, data, options);
    }

    return [];
  }

  private retrieveBitmap(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    const image = this.image.lookup(current, data);

    return [
      {
        kind: 'web',
        value: image,
        language: 'binary',
        uri: `${options.assetDir}/${this.format.normalizeName(
          current.name
        )}.jpg`
      }
    ];
  }

  private compileOptions(options: WebBlocGenOptions) {
    return {
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
