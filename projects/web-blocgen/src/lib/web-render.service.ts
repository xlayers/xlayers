import { Injectable } from "@angular/core";
import { ResourceService, FormatService } from "@xlayers/sketch-lib";
import { WebOptimizerService } from "./web-optimizer.service";
import { WebContextService } from "./web-context.service";
import { WebBlocGenOptions } from "./web-blocgen.d";

@Injectable({
  providedIn: "root"
})
export class WebRenderService {
  constructor(
    private format: FormatService,
    private resource: ResourceService,
    private webContext: WebContextService,
    private webOptimize: WebOptimizerService
  ) {}

  render(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    const name = this.format.normalizeName(current.name);
    const context = this.webContext.contextOf(current);

    return [
      ...this.traverse(data, current, options).map(file => ({
        ...file,
        kind: "web"
      })),
      {
        kind: "web",
        value: context.html.join("\n"),
        language: "html",
        uri: `${options.componentDir}/${name}.html`
      },
      {
        kind: "web",
        value: this.webOptimize.optimize(current),
        language: "css",
        uri: `${options.componentDir}/${name}.css`
      }
    ];
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
    if (this.resource.identifySymbolInstance(current)) {
      return this.retrieveSymbolMaster(data, current, options);
    }
    if (this.resource.identifyBitmap(current)) {
      return this.retrieveBitmap(data, current, options);
    }
    return [];
  }

  private retrieveSymbolMaster(
    data: SketchMSData,
    current: SketchMSLayer,
    options: WebBlocGenOptions
  ) {
    const symbolMaster = this.resource.lookupSymbolMaster(current, data);

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
    const image = this.lookupImage(current, data);

    return [
      {
        kind: "web",
        value: image,
        language: "binary",
        uri: `${options.assetDir}/${this.format.normalizeName(
          current.name
        )}.jpg`
      }
    ];
  }

  private lookupImage(current: SketchMSLayer, data: SketchMSData) {
    const content = this.resource.lookupBitmap(current, data);
    const bin = atob(content);
    const buf = new Uint8Array(bin.length);
    Array.prototype.forEach.call(bin, (ch, i) => {
      buf[i] = ch.charCodeAt(0);
    });
    return buf;
  }
}
