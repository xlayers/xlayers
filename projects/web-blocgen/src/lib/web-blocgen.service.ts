import { Injectable } from '@angular/core';
import { ImageService, SymbolService, LayerService } from '@xlayers/sketch-lib';
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
    private webContext: WebContextService,
    private webParser: WebParserService,
    private webComponentRender: WebComponentRenderService,
    private vueRender: VueRenderService,
    private angularRender: AngularRenderService,
    private litElementRender: LitElementRenderService,
    private reactRender: ReactRenderService,
    private stencilRender: StencilRenderService,
    private webRender: WebRenderService,
    private layer: LayerService
  ) {}

  compute(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebBlocGenOptions
  ) {
    this.webParser.compute(current, data, this.compileOptions(options));
  }

  render(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebBlocGenOptions
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
    options?: WebBlocGenOptions
  ) {
    switch (options.mode) {
      case 'vue':
        return this.visitContent(current, data, options).concat(
          this.vueRender.render(current, options)
        );

      case 'angular':
        return this.visitContent(current, data, options).concat(
          this.angularRender.render(current, options)
        );

      case 'litElement':
        return this.visitContent(current, data, options).concat(
          this.litElementRender.render(current, options)
        );

      case 'react':
        return this.visitContent(current, data, options).concat(
          this.reactRender.render(current, { ...options, jsx: true })
        );

      case 'webComponent':
        return this.visitContent(current, data, options).concat(
          this.webComponentRender.render(current, options)
        );

      case 'stencil':
        return this.visitContent(current, data, options).concat(
          this.stencilRender.render(current, {
            ...options,
            jsx: true
          })
        );

      default:
        return this.visitContent(current, data, options).concat(
          this.webRender.render(current, options)
        );
    }
  }

  private visitContent(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    if (this.layer.identify(current)) {
      return this.visitLayer(current, data, options);
    } else if (this.symbol.identify(current)) {
      return this.visitSymbolMaster(current, data, options);
    } else if (this.image.identify(current)) {
      return this.image.render(current, data, options);
    }
    return [];
  }

  private visitLayer(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    return this.layer
      .lookup(current, data)
      .flatMap(layer => this.visitContent(layer, data, options));
  }

  private visitSymbolMaster(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    const symbolMaster = this.symbol.lookup(current, data);
    if (symbolMaster) {
      return this.visit(symbolMaster, data, options);
    }
    return [];
  }

  private compileOptions(options: WebBlocGenOptions) {
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
