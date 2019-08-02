import { Injectable } from '@angular/core';
import {
  ImageService,
  FormatService,
  SymbolService
} from '@xlayers/sketch-lib';
import { CssBlocGenService } from '@xlayers/css-blocgen';
import { SvgBlocGenService } from '@xlayers/svg-blocgen';
import { TextService } from '@xlayers/sketch-lib';
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
    private cssBlocGen: CssBlocGenService,
    private svgBlocGen: SvgBlocGenService,
    private webContext: WebContextService
  ) {}

  compute(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    this.svgBlocGen.compute(current, data);
    this.cssBlocGen.compute(current, data, options);
    this.visit(data, current, current, 0, options);
  }

  private visit(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number,
    options: WebBlocGenOptions
  ) {
    this.putOpenTag(current, root, depth, options);
    this.putContent(current, root, data, depth, options);
    this.putClosingTag(root, depth);
  }

  private traverseLayer(
    current: SketchMSLayer,
    root: SketchMSLayer,
    data: SketchMSData,
    depth: number,
    options: WebBlocGenOptions
  ) {
    if (current.layers && Array.isArray(current.layers)) {
      current.layers.forEach(layer => {
        if (this.webContext.identify(current)) {
          this.visit(data, layer, root, depth, options);
        }
      });
    } else if (this.symbol.identify(current)) {
      return this.traverseSymbol(data, current, root, depth, options);
    } else {
      return this.extractLayerContent(current, depth, options);
    }
  }

  private traverseSymbol(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number,
    options: WebBlocGenOptions
  ) {
    const symbolMaster = this.symbol.lookup(current, data);

    if (symbolMaster) {
      this.compute(symbolMaster, data, options);

      const tagName = this.format.normalizeName(current.name);

      this.webContext.putContext(root, {
        ...this.webContext.contextOf(root),
        components: [...this.webContext.contextOf(root).components, tagName]
      });

      const tag = `<${tagName}/>`;

      return [this.format.indent(depth, tag)];
    }

    return '';
  }

  private extractLayerContent(
    current: SketchMSLayer,
    depth: number,
    options: WebBlocGenOptions
  ) {
    if (this.image.identify(current)) {
      return this.extractBitmap(current, depth, options);
    }
    if (this.text.identify(current)) {
      return this.extractText(current, depth);
    }
    if (this.svgBlocGen.identify(current)) {
      return this.extractShape(current, depth);
    }
    return [];
  }

  private extractBitmap(
    current: SketchMSLayer,
    depth: number,
    options: WebBlocGenOptions
  ) {
    const className = this.cssBlocGen.context(current).className;
    const attributes = [
      ...(className
        ? [`${options.jsx ? 'className' : 'class'}="${className}"`]
        : []),
      `role="${current._class}"`,
      `aria-label="${current.name}"`,
      `src="${options.assetDir}/${this.format.normalizeName(current.name)}.jpg"`
    ];
    const tag = ['<img', ...attributes].join(' ') + '>';

    return [this.format.indent(depth, tag)];
  }

  private extractText(current: SketchMSLayer, depth: number) {
    const content = this.text.lookup(current);
    const tag = `<span>${content}</span>`;

    return [this.format.indent(depth, tag)];
  }

  private extractShape(current: SketchMSLayer, depth: number) {
    return this.svgBlocGen
      .render(current, { xmlNamespace: false })
      .flatMap(file =>
        file.value.split('\n').map(line => this.format.indent(depth, line))
      );
  }

  private putContent(
    current: SketchMSLayer,
    root: SketchMSLayer,
    data: SketchMSData,
    depth: number,
    options: WebBlocGenOptions
  ) {
    const content = this.traverseLayer(current, root, data, depth + 1, options);
    if (content) {
      const context = this.webContext.contextOf(root);
      this.webContext.putContext(root, {
        html: [...context.html, ...content]
      });
    }
  }

  private putOpenTag(
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number,
    options: WebBlocGenOptions
  ) {
    const className = this.cssBlocGen.context(current).className;
    const attributes = [
      ...(className
        ? [`${options.jsx ? 'className' : 'class'}="${className}"`]
        : []),
      `role="${current._class}"`,
      `aria-label="${current.name}"`
    ];
    const tag = ['<div', ...attributes].join(' ') + '>';

    const context = this.webContext.contextOf(root);
    this.webContext.putContext(root, {
      html: [...context.html, this.format.indent(depth, tag)]
    });
  }

  private putClosingTag(root: SketchMSLayer, depth: number) {
    const context = this.webContext.contextOf(root);
    this.webContext.putContext(root, {
      html: [...context.html, this.format.indent(depth, '</div>')]
    });
  }
}