import { Injectable } from '@angular/core';
import { XmlService } from '@xlayers/std-library';
import { FormatService } from '@xlayers/std-library';
import { CssBlocGenService } from '@xlayers/css-blocgen';
import { BitmapBlocGenService } from '@xlayers/bitmap-blocgen';
import { SvgBlocGenService } from '@xlayers/svg-blocgen';
import { TextBlocGenService } from '@xlayers/text-blocgen';
import { VueContextService } from './vue-context.service';
import { SvgContextService } from '@xlayers/svg-blocgen';
import { CssContextService } from '@xlayers/css-blocgen';
import { TextContextService } from '@xlayers/text-blocgen';
import { BitmapContextService } from '@xlayers/bitmap-blocgen';

@Injectable({
  providedIn: 'root'
})
export class VueParserService {
  constructor(
    private xmlHelperService: XmlService,
    private lintService: FormatService,
    private cssBlocGenService: CssBlocGenService,
    private bitmapBlocGenService: BitmapBlocGenService,
    private bitmapContextService: BitmapContextService,
    private svgBlocGenService: SvgBlocGenService,
    private vueContextService: VueContextService,
    private textBlocGenService: TextBlocGenService,
    private textContextService: TextContextService,
    private cssContextService: CssContextService,
    private svgContextService: SvgContextService
  ) {}

  compute(data: SketchMSData, current: SketchMSLayer) {
    this.vueContextService.putContext(current);
    this.traverse(data, current, current);
  }

  traverse(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number = 0
  ) {
    if (this.vueContextService.identify(current)) {
      current.layers.forEach(layer => {
        if (this.svgContextService.identify(layer)) {
          this.traverseSvgLayer(data, layer, root, depth);
        } else if (this.cssContextService.identify(layer)) {
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
    if (this.bitmapContextService.identify(current)) {
      return this.extractImage(data, current, depth);
    }
    if (this.textContextService.identify(current)) {
      return this.extractText(data, current, depth);
    }
    if (this.svgContextService.identify(current)) {
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

    this.vueContextService.putContext(root, {
      ...this.vueContextService.contextOf(root),
      css: [...this.vueContextService.contextOf(root).css, ...cssRules]
    });

    const content = this.traverse(data, current, root, depth);
    if (content) {
      this.vueContextService.putContext(root, {
        ...this.vueContextService.contextOf(root),
        html: [...this.vueContextService.contextOf(root).html, content]
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

    this.vueContextService.putContext(root, {
      ...this.vueContextService.contextOf(root),
      css: [...this.vueContextService.contextOf(root).css, ...cssRules]
    });
    this.vueContextService.putContext(root, {
      ...this.vueContextService.contextOf(root),
      html: [
        ...this.vueContextService.contextOf(root).html,
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
    this.vueContextService.putContext(root, {
      ...this.vueContextService.contextOf(root),
      html: [
        ...this.vueContextService.contextOf(root).html,
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
      this.vueContextService.putContext(root, {
        ...this.vueContextService.contextOf(root),
        html: [...this.vueContextService.contextOf(root).html, content]
      });
    }

    this.vueContextService.putContext(root, {
      ...this.vueContextService.contextOf(root),
      html: [
        ...this.vueContextService.contextOf(root).html,
        this.lintService.indent(depth, this.xmlHelperService.closeTag('div'))
      ]
    });
  }

  private extractCssOpenTag(current: SketchMSLayer) {
    const context = this.cssContextService.contextOf(current);
    const attributes = [
      `class="${context.className}"`,
      `role="${current._class}"`,
      `aria-label="${current.name}"`
    ];
    return this.xmlHelperService.openTag('div', attributes);
  }

  private extractOpenTag(current: SketchMSLayer) {
    const attributes = [
      `role="${current._class}"`,
      `aria-label="${current.name}"`
    ];
    return this.xmlHelperService.openTag('div', attributes);
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
          this.xmlHelperService.openTag('span') +
          file.value +
          this.xmlHelperService.closeTag('span')
      )
      .join('\n');

    return this.lintService.indent(depth, content);
  }

  private extractImage(
    data: SketchMSData,
    current: SketchMSLayer,
    depth: number
  ) {
    const context = this.cssContextService.contextOf(current);
    const content = this.bitmapBlocGenService
      .transform(current, data)
      .map(file => {
        const attributes = [
          `class="${context.className}"`,
          `role="${current._class}"`,
          `aria-label="${current.name}"`,
          `src="data:image/jpg;base64,${file.value}"`
        ];
        return this.xmlHelperService.openTag('img', attributes, {
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
    const foreignSymbol = data.document.foreignSymbols.find(
      x => x.symbolMaster.symbolID === (current as any).symbolID
    );

    this.compute(data, foreignSymbol.symbolMaster);

    const content = this.xmlHelperService.openTag(current.name, [], {
      autoclose: true
    });

    return this.lintService.indent(depth, content);
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
