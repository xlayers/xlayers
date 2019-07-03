import { Injectable } from '@angular/core';
import { XmlService, FormatService, AstService } from '@xlayers/std-library';
import { CssBlocGenService } from '@xlayers/css-blocgen';
import { BitmapBlocGenService } from '@xlayers/bitmap-blocgen';
import { SvgBlocGenService } from '@xlayers/svg-blocgen';
import { TextBlocGenService } from '@xlayers/text-blocgen';
import { VueContextService } from './vue-context.service';

@Injectable({
  providedIn: 'root'
})
export class VueParserService {
  constructor(
    private xmlService: XmlService,
    private lintService: FormatService,
    private astService: AstService,
    private cssBlocGenService: CssBlocGenService,
    private bitmapBlocGenService: BitmapBlocGenService,
    private svgBlocGenService: SvgBlocGenService,
    private vueBlocGenService: VueContextService,
    private textBlocGenService: TextBlocGenService
  ) {}

  compute(data: SketchMSData, current: SketchMSLayer) {
    this.vueBlocGenService.putContext(current);
    this.traverse(data, current, current);
  }

  traverse(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number = 0
  ) {
    if (this.vueBlocGenService.identify(current)) {
      current.layers.forEach(layer => {
        if (this.svgBlocGenService.identify(layer)) {
          this.traverseSvgLayer(data, layer, root, depth);
        } else if (this.cssBlocGenService.identify(layer)) {
          this.traverseStyledLayer(data, layer, root, depth);
        } else {
          this.traverseLayer(data, layer, root, depth);
        }
      });
    } else {
      return this.traverseEdgeLayer(data, current, depth);
    }
  }

  private traverseEdgeLayer(
    data: SketchMSData,
    current: SketchMSLayer,
    depth: number
  ) {
    if ((current._class as string) === 'symbolInstance') {
      return this.extractSymbolMaster(data, current, depth);
    }
    if (this.bitmapBlocGenService.identify(current)) {
      return this.extractImage(data, current, depth);
    }
    if (this.textBlocGenService.identify(current)) {
      return this.extractText(data, current, depth);
    }
    if (this.svgBlocGenService.identify(current)) {
      return this.extractShape(data, current, depth);
    }
    return null;
  }

  private traverseSvgLayer(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number
  ) {
    const cssRules = this.cssBlocGenService
      .transform(current, data)
      .map(file => file.value);

    this.vueBlocGenService.putContext(root, {
      ...this.vueBlocGenService.contextOf(root),
      css: [...this.vueBlocGenService.contextOf(root).css, ...cssRules]
    });

    const content = this.traverse(data, current, root, depth);
    if (content) {
      this.vueBlocGenService.putContext(root, {
        ...this.vueBlocGenService.contextOf(root),
        html: [...this.vueBlocGenService.contextOf(root).html, content]
      });
    }
  }

  private traverseStyledLayer(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number
  ) {
    const cssRules = this.cssBlocGenService
      .transform(current, data)
      .map(file => file.value);

    this.vueBlocGenService.putContext(root, {
      ...this.vueBlocGenService.contextOf(root),
      css: [...this.vueBlocGenService.contextOf(root).css, ...cssRules]
    });
    this.vueBlocGenService.putContext(root, {
      ...this.vueBlocGenService.contextOf(root),
      html: [
        ...this.vueBlocGenService.contextOf(root).html,
        this.lintService.indent(depth, this.extractCssOpenTag(current))
      ]
    });

    this.closingLayer(data, current, root, depth);
  }

  private traverseLayer(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number
  ) {
    this.vueBlocGenService.putContext(root, {
      ...this.vueBlocGenService.contextOf(root),
      html: [
        ...this.vueBlocGenService.contextOf(root).html,
        this.lintService.indent(depth, this.extractOpenTag(current))
      ]
    });

    this.closingLayer(data, current, root, depth);
  }

  private closingLayer(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number
  ) {
    const content = this.traverse(data, current, root, depth + 1);
    if (content) {
      this.vueBlocGenService.putContext(root, {
        ...this.vueBlocGenService.contextOf(root),
        html: [...this.vueBlocGenService.contextOf(root).html, content]
      });
    }

    this.vueBlocGenService.putContext(root, {
      ...this.vueBlocGenService.contextOf(root),
      html: [
        ...this.vueBlocGenService.contextOf(root).html,
        this.lintService.indent(depth, this.xmlService.closeTag('div'))
      ]
    });
  }

  private extractCssOpenTag(current: SketchMSLayer) {
    const context = this.cssBlocGenService.contextOf(current);
    const attributes = [
      `class="${context.className}"`,
      `role="${current._class}"`,
      `aria-label="${current.name}"`
    ];
    return this.xmlService.openTag('div', attributes);
  }

  private extractOpenTag(current: SketchMSLayer) {
    const attributes = [
      `role="${current._class}"`,
      `aria-label="${current.name}"`
    ];
    return this.xmlService.openTag('div', attributes);
  }

  private extractText(
    data: SketchMSData,
    current: SketchMSLayer,
    depth: number
  ) {
    const content = this.textBlocGenService
      .transform(current, data)
      .map(
        file =>
          this.xmlService.openTag('span') +
          file.value +
          this.xmlService.closeTag('span')
      )
      .join('\n');

    return this.lintService.indent(depth, content);
  }

  private extractImage(
    data: SketchMSData,
    current: SketchMSLayer,
    depth: number
  ) {
    const context = this.cssBlocGenService.contextOf(current);
    const content = this.bitmapBlocGenService
      .transform(current, data)
      .map(file => {
        const attributes = [
          `class="${context.className}"`,
          `role="${current._class}"`,
          `aria-label="${current.name}"`,
          `src="data:image/jpg;base64,${file.value}"`
        ];
        return this.xmlService.openTag('img', attributes, {
          autoclose: true
        });
      })
      .join('\n');

    return this.lintService.indent(depth, content);
  }

  private extractSymbolMaster(
    data: SketchMSData,
    current: SketchMSLayer,
    depth: number
  ) {
    const symbolMaster = this.astService.maybeFindSymbolMaster(current, data);

    if (symbolMaster) {
      this.compute(data, symbolMaster);

      const content = this.xmlService.openTag(current.name, [], {
        autoclose: true
      });

      return this.lintService.indent(depth, content);
    }
  }

  private extractShape(
    data: SketchMSData,
    current: SketchMSLayer,
    depth: number
  ) {
    return this.svgBlocGenService
      .transform(current, data)
      .map(file =>
        file.value
          .split('\n')
          .map(line => this.lintService.indent(depth, line))
          .join('\n')
      )
      .join('\n');
  }
}
