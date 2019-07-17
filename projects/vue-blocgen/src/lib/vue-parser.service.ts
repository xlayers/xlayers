import { Injectable } from '@angular/core';
import {
  XmlService,
  FormatService,
  ResourceService
} from '@xlayers/std-library';
import { CssBlocGenService } from '@xlayers/css-blocgen';
import { SvgBlocGenService } from '@xlayers/svg-blocgen';
import { AstService } from '@xlayers/std-library';
import { VueContextService } from './vue-context.service';

@Injectable({
  providedIn: 'root'
})
export class VueParserService {
  constructor(
    private astService: AstService,
    private xmlService: XmlService,
    private formatService: FormatService,
    private resourceService: ResourceService,
    private cssBlocGenService: CssBlocGenService,
    private svgBlocGenService: SvgBlocGenService,
    private vueBlocGenService: VueContextService
  ) {}

  compute(data: SketchMSData, current: SketchMSLayer) {
    if (!this.vueBlocGenService.hasContext(current)) {
      this.vueBlocGenService.putContext(current);
    }
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
        this.traverseLayer(data, layer, root, depth);
      });
    } else if (this.resourceService.identifySymbolInstance(current)) {
      return this.traverseSymbolMaster(data, current, root, depth);
    } else {
      return this.extractLayerContent(data, current, depth);
    }
  }

  private extractLayerContent(
    data: SketchMSData,
    current: SketchMSLayer,
    depth: number
  ) {
    if (this.resourceService.identifyBitmap(current)) {
      return this.extractBitmap(data, current, depth);
    }
    if (this.astService.identifyText(current)) {
      return this.extractText(current, depth);
    }
    if (this.svgBlocGenService.identify(current)) {
      return this.extractShape(current, depth);
    }
    return null;
  }

  private traverseLayer(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number
  ) {
    const cssRules = this.cssBlocGenService
      .transform(current)
      .map(file => file.value);

    this.vueBlocGenService.putContext(root, {
      ...this.vueBlocGenService.contextOf(root),
      css: [...this.vueBlocGenService.contextOf(root).css, ...cssRules]
    });
    this.vueBlocGenService.putContext(root, {
      ...this.vueBlocGenService.contextOf(root),
      html: [
        ...this.vueBlocGenService.contextOf(root).html,
        this.formatService.indent(depth, this.extractOpenTag(current))
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
        this.formatService.indent(depth, this.xmlService.closeTag('div'))
      ]
    });
  }

  private extractOpenTag(current: SketchMSLayer) {
    const context = this.cssBlocGenService.contextOf(current);
    const attributes = [
      `class="${context.className}"`,
      `role="${current._class}"`,
      `aria-label="${this.formatService.normalizeName(current.name)}"`
    ];
    return this.xmlService.openTag('div', attributes);
  }

  private extractText(current: SketchMSLayer, depth: number) {
    const content = this.astService.lookupText(current);
    const tag =
      this.xmlService.openTag('span') +
      content +
      this.xmlService.closeTag('span');

    return this.formatService.indent(depth, tag);
  }

  private extractBitmap(
    data: SketchMSData,
    current: SketchMSLayer,
    depth: number
  ) {
    const context = this.cssBlocGenService.contextOf(current);
    const content = this.resourceService.lookupBitmap(current, data);
    const attributes = [
      `class="${context.className}"`,
      `role="${current._class}"`,
      `aria-label="${this.formatService.normalizeName(current.name)}"`,
      `src="data:image/jpg;base64,${content}"`
    ];
    const tag = this.xmlService.openTag('img', attributes, {
      autoclose: true
    });

    return this.formatService.indent(depth, tag);
  }

  private traverseSymbolMaster(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number
  ) {
    const symbolMaster = this.resourceService.lookupSymbolMaster(current, data);

    if (symbolMaster) {
      this.compute(data, symbolMaster);

      const tagName = this.formatService.normalizeName(current.name);

      this.vueBlocGenService.putContext(root, {
        ...this.vueBlocGenService.contextOf(root),
        components: [
          ...this.vueBlocGenService.contextOf(root).components,
          tagName
        ]
      });

      const content = this.xmlService.openTag(tagName, [], {
        autoclose: true
      });

      return this.formatService.indent(depth, content);
    }
  }

  private extractShape(current: SketchMSLayer, depth: number) {
    return this.svgBlocGenService
      .transform(current)
      .map(file =>
        file.value
          .split('\n')
          .map(line => this.formatService.indent(depth, line))
          .join('\n')
      )
      .join('\n');
  }
}
