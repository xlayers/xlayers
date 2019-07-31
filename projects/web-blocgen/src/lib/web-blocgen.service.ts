import { Injectable } from "@angular/core";
import {
  FormatService,
  ImageService,
  SymbolService
} from "@xlayers/sketch-lib";
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

const DEFAULT_OPTIONS: WebBlocGenOptions = {
  mode: "web",
  jsx: false,
  xmlPrefix: "xly-",
  cssPrefix: "xly_",
  componentDir: "components",
  assetDir: "assets"
};

@Injectable({
  providedIn: "root"
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

  transform(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebBlocGenOptions
  ) {
    if (!this.webContext.hasContext(current)) {
      this.compute(current, data, options);
    }

    return this.render(current, data, options);
  }

  compute(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebBlocGenOptions
  ) {
    this.webParser.compute(current, data, {
      ...DEFAULT_OPTIONS,
      ...options
    });
  }

  render(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebBlocGenOptions
  ) {
    const defaultOptions = { ...DEFAULT_OPTIONS, ...options };

    switch (options.mode) {
      case "vue":
        return [
          ...this.traverse(data, current, defaultOptions),
          ...this.vueRender.render(current, defaultOptions)
        ];

      case "angular":
        return [
          ...this.traverse(data, current, defaultOptions),
          ...this.angularRender.render(current, options)
        ];

      case "lit-element":
        return [
          ...this.traverse(data, current, defaultOptions),
          ...this.litElementRender.render(current, defaultOptions)
        ];

      case "react":
        return [
          ...this.traverse(data, current, defaultOptions),
          ...this.reactRender.render(current, defaultOptions)
        ];

      case "web-component":
        return [
          ...this.traverse(data, current, defaultOptions),
          ...this.webComponentRender.render(current, defaultOptions)
        ];

      case "stencil":
        return [
          ...this.traverse(data, current, defaultOptions),
          ...this.stencilRender.render(current, defaultOptions)
        ];

      default:
        return [
          ...this.traverse(data, current, defaultOptions),
          ...this.webRender.render(current, options)
        ];
    }
  }

  identify(current: SketchMSLayer) {
    return this.webContext.identify(current);
  }

  hasContext(current: SketchMSLayer) {
    return this.webContext.hasContext(current);
  }

  contextOf(current: SketchMSLayer) {
    return this.webContext.contextOf(current);
  }

  private traverse(
    data: SketchMSData,
    current: SketchMSLayer,
    options: WebBlocGenOptions
  ) {
    if (this.webContext.identify(current)) {
      return (current.layers as any).flatMap(layer =>
        this.traverse(data, layer, options)
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
      return this.retrieveSymbolMaster(data, current, options);
    }
    if (this.image.identify(current)) {
      return this.retrieveBitmap(data, current, options);
    }
    return [];
  }

  private retrieveSymbolMaster(
    data: SketchMSData,
    current: SketchMSLayer,
    options: WebBlocGenOptions
  ) {
    const symbolMaster = this.symbol.lookup(current, data);

    if (symbolMaster) {
      return this.render(symbolMaster, data, options);
    }

    return [];
  }

  private retrieveBitmap(
    data: SketchMSData,
    current: SketchMSLayer,
    options: WebBlocGenOptions
  ) {
    const image = this.image.lookup(current, data);

    return [
      {
        kind: "web",
        value: image,
        language: "binary",
        uri: `${options.assetDir}/${this.format.snakeName(current.name)}.jpg`
      }
    ];
  }
}
