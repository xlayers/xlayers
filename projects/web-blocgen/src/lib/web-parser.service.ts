import { Injectable } from '@angular/core';
import { CssBlocGenService } from '@xlayers/css-blocgen';
import {
  FormatService,
  ImageService,
  LayerService,
  SymbolService
} from '@xlayers/sketch-lib';
import { TextService } from '@xlayers/sketch-lib';
import { SvgBlocGenService } from '@xlayers/svg-blocgen';

import { WebBlocGenOptions } from './web-blocgen.d';
import { WebContextService } from './web-context.service';

@Injectable({
  providedIn: 'root'
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
    if (current._class === 'page') {
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
    } else if (this.symbol.identify(current)) {
      this.visitSymbol(current, data, options);
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
    if (this.webContext.identify(current)) {
      if (!this.webContext.of(current)) {
        this.visitContent(current, options);
      }
    }
    this.walk(current, data, options);
  }

  private visitContent(current: SketchMSLayer, options: WebBlocGenOptions) {
    if (this.image.identify(current)) {
      this.visitBitmap(current, options);
    } else if (this.text.identify(current)) {
      this.visitText(current);
    } else if (this.svgBlocGen.identify(current)) {
      this.visitShape(current);
    } else {
      this.visitLayer(current, options);
    }
  }

  private visitLayer(current: SketchMSLayer, options: WebBlocGenOptions) {
    this.webContext.put(current, {
      attributes: [
        ...this.generateClassAttribute(current),
        `role="${current._class}"`,
        `aria-label="${current.name}"`
      ]
    });
  }

  private visitSymbol(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    const symbolMaster = this.symbol.lookup(current, data);
    if (symbolMaster) {
      this.compute(symbolMaster, data, options);
      const context = this.webContext.of(current);
      this.webContext.put(current, {
        components:
          context && context.components
            ? [...context.components, current.name]
            : [current.name]
      });
    }
  }

  private visitBitmap(current: SketchMSLayer, options: WebBlocGenOptions) {
    const fileName = this.format.normalizeName(current.name);
    this.webContext.put(current, {
      attributes: [
        ...this.generateClassAttribute(current),
        `role="${current._class}"`,
        `aria-label="${current.name}"`,
        `src="/${options.assetDir}/${fileName}.png"`
      ]
    });
  }

  private visitText(current: SketchMSLayer) {
    this.webContext.put(current, {
      attributes: this.generateClassAttribute(current)
    });
  }

  private visitShape(current: SketchMSLayer) {
    this.webContext.put(current, {
      attributes: this.generateClassAttribute(current)
    });
  }

  private generateClassAttribute(current: SketchMSLayer) {
    if (this.cssBlocGen.identify(current)) {
      const className = this.cssBlocGen.context(current).className;
      if (className) {
        return [`class="${className}"`];
      }
    }
    return [];
  }
}
