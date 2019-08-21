import { Injectable } from "@angular/core";
import {
  ImageService,
  FormatService,
  SymbolService,
  LayerService
} from "@xlayers/sketch-lib";
import { CssBlocGenService } from "@xlayers/css-blocgen";
import { SvgBlocGenService } from "@xlayers/svg-blocgen";
import { TextService } from "@xlayers/sketch-lib";
import { WebBlocGenOptions } from "./web-blocgen.d";
import { WebContextService } from "./web-context.service";

@Injectable({
  providedIn: "root"
})
export class WebParserService {
  constructor(
    private text: TextService,
    private format: FormatService,
    private symbol: SymbolService,
    private image: ImageService,
    private layer: LayerService,
    private cssBlocGen: CssBlocGenService,
    private svgBlocGen: SvgBlocGenService,
    private webContext: WebContextService
  ) {}

  compute(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    this.svgBlocGen.compute(current, data, options);
    this.cssBlocGen.compute(current, data, options);

    if (current._class === "page") {
      this.walk(current, data, options);
    } else {
      this.visit(current, data, options);
    }
  }

  private walk(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    if (this.layer.identify(current)) {
      current.layers.forEach(layer => {
        this.visit(layer, data, options);
      });
    }
  }

  private visit(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    if (options.force) {
      this.webContext.clear(current);
    }

    if (this.symbol.identify(current)) {
      this.visitSymbol(current, data, options);
    } else if (this.image.identify(current)) {
      this.visitBitmap(current, options);
    } else if (this.text.identify(current)) {
      this.visitText(current);
    } else if (this.webContext.identify(current)) {
      this.visitLayer(current, data, options);
    }
  }

  private visitLayer(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    const className = this.cssBlocGen.context(current).className;

    this.webContext.put(current, {
      attributes: [
        ...(className
          ? [`${options.jsx ? "className" : "class"}="${className}"`]
          : []),
        `role="${current._class}"`,
        `aria-label="${current.name}"`
      ],
      type: "block"
    });

    this.walk(current, data, options);
  }

  private visitSymbol(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    const symbolMaster = this.symbol.lookup(current, data);

    if (symbolMaster) {
      this.compute(symbolMaster, data, options);

      this.webContext.put(current, {
        components: [...this.webContext.of(current).components, current.name]
      });
    }
  }

  private visitBitmap(current: SketchMSLayer, options: WebBlocGenOptions) {
    const className = this.cssBlocGen.context(current).className;
    const fileName = this.format.normalizeName(current.name);

    this.webContext.put(current, {
      attributes: [
        ...(className
          ? [`${options.jsx ? "className" : "class"}="${className}"`]
          : []),
        `role="${current._class}"`,
        `aria-label="${current.name}"`,
        `src="${options.assetDir}/${fileName}.jpg`
      ],
      type: "image"
    });
  }

  private visitText(current: SketchMSLayer) {
    this.webContext.put(current, {
      type: "text"
    });
  }
}
