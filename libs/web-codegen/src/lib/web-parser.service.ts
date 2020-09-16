import { Injectable } from '@angular/core';
import { CssCodeGenService } from '@xlayers/css-codegen';
import {
  FormatService,
  ImageService,
  LayerService,
  SymbolService,
} from '@xlayers/sketch-lib';
import { TextService } from '@xlayers/sketch-lib';
import { SvgCodeGenService } from '@xlayers/svg-codegen';

import { WebCodeGenOptions } from './web-codegen.d';
import { WebContextService } from './web-context.service';
import { SketchMSLayer, SketchMSData } from '@xlayers/sketchtypes';

@Injectable({
  providedIn: 'root',
})
export class WebParserService {
  constructor(
    private readonly textService: TextService,
    private readonly formatService: FormatService,
    private readonly symbolService: SymbolService,
    private readonly imageService: ImageService,
    private readonly layerService: LayerService,
    private readonly cssCodeGen: CssCodeGenService,
    private readonly svgCodeGen: SvgCodeGenService,
    private readonly webContext: WebContextService
  ) {}

  compute(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebCodeGenOptions
  ) {
    this.svgCodeGen.compute(current, data, options);
    this.cssCodeGen.compute(current, data, options);
    if (current._class === 'page') {
      this.walk(current, data, options);
    } else {
      this.visit(current, data, options);
    }
  }

  private walk(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebCodeGenOptions
  ) {
    if (this.layerService.identify(current)) {
      current.layers.forEach((layer) => {
        this.visit(layer, data, options);
      });
    } else if (this.symbolService.identify(current)) {
      this.visitSymbol(current, data, options);
    }
  }

  private visit(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebCodeGenOptions
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

  private visitContent(current: SketchMSLayer, options: WebCodeGenOptions) {
    if (this.imageService.identify(current)) {
      this.visitBitmap(current, options);
    } else if (this.textService.identify(current)) {
      this.visitText(current);
    } else if (this.svgCodeGen.identify(current)) {
      this.visitShape(current);
    } else {
      this.visitLayer(current, options);
    }
  }

  private visitLayer(current: SketchMSLayer, options: WebCodeGenOptions) {
    this.webContext.put(current, {
      attributes: [
        ...this.generateClassAttribute(current),
        `role="${current._class}"`,
        `aria-label="${current.name}"`,
      ],
    });
  }

  private visitSymbol(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebCodeGenOptions
  ) {
    const symbolMaster = this.symbolService.lookup(current, data);
    if (symbolMaster) {
      this.compute(symbolMaster, data, options);
      const context = this.webContext.of(current);
      this.webContext.put(current, {
        components:
          context && context.components
            ? [...context.components, current.name]
            : [current.name],
      });
    }
  }

  private visitBitmap(current: SketchMSLayer, options: WebCodeGenOptions) {
    const fileName = this.formatService.normalizeName(current.name);
    this.webContext.put(current, {
      attributes: [
        ...this.generateClassAttribute(current),
        `role="${current._class}"`,
        `aria-label="${current.name}"`,
        `src="/${options.assetDir}/${fileName}.png"`,
      ],
    });
  }

  private visitText(current: SketchMSLayer) {
    this.webContext.put(current, {
      attributes: this.generateClassAttribute(current),
    });
  }

  private visitShape(current: SketchMSLayer) {
    this.webContext.put(current, {
      attributes: this.generateClassAttribute(current),
    });
  }

  private generateClassAttribute(current: SketchMSLayer) {
    if (this.cssCodeGen.identify(current)) {
      const className = this.cssCodeGen.context(current).className;
      if (className) {
        return [`class="${className}"`];
      }
    }
    return [];
  }
}
