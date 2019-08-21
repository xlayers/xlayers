import { Injectable } from "@angular/core";
import { ImageService, SymbolService, LayerService } from "@xlayers/sketch-lib";
import { WebContextService } from "./web-context.service";
import { WebParserService } from "./web-parser.service";
import { WebRenderService } from "./web-render.service";
import { VueRenderService } from "./vue-render.service";
import { AngularRenderService } from "./angular-render.service";
import { ReactRenderService } from "./react-render.service";
import { LitElementRenderService } from "./lit-element-render.service";
import { WebBlocGenOptions } from "./web-blocgen.d";
import { StencilRenderService } from "./stencil-render.service";
import { WebComponentRenderService } from "./web-component-render.service";

@Injectable({
  providedIn: "root"
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
    return this.traverseAndRender(current, data, this.compileOptions(options));
  }

  identify(current: SketchMSLayer) {
    return this.webContext.identify(current);
  }

  context(current: SketchMSLayer) {
    return this.webContext.of(current);
  }

  private traverseAndRender(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebBlocGenOptions
  ) {
    switch (options.mode) {
      case "vue":
        return [
          ...this.traverse(current, data, options),
          ...this.vueRender.render(current, options)
        ];

      case "angular":
        return [
          ...this.traverse(current, data, options),
          ...this.angularRender.render(current, options)
        ];

      case "litElement":
        return [
          ...this.traverse(current, data, options),
          ...this.litElementRender.render(current, options)
        ];

      case "react":
        return [
          ...this.traverse(current, data, { ...options, jsx: true }),
          ...this.reactRender.render(current, { ...options, jsx: true })
        ];

      case "webComponent":
        return [
          ...this.traverse(current, data, options),
          ...this.webComponentRender.render(current, options)
        ];

      case "stencil":
        return [
          ...this.traverse(current, data, { ...options, jsx: true }),
          ...this.stencilRender.render(current, {
            ...options,
            jsx: true
          })
        ];

      default:
        return [
          ...this.traverse(current, data, options),
          ...this.webRender.render(current, options)
        ];
    }
  }

  private traverse(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    if (this.layer.identify(current)) {
      return this.layer
        .lookup(current, data)
        .flatMap(layer => this.traverse(layer, data, options));
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
      return this.image.render(current, data, options);
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

  private compileOptions(options: WebBlocGenOptions) {
    return {
      textTagName: "span",
      bitmapTagName: "img",
      blockTagName: "div",
      mode: "web",
      jsx: false,
      xmlPrefix: "xly-",
      cssPrefix: "xly_",
      componentDir: "components",
      assetDir: "assets",
      ...options
    };
  }
}
