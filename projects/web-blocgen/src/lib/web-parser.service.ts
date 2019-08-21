import { Injectable } from '@angular/core';
import {
  ImageService,
  FormatService,
  SymbolService,
  LayerService
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
      current.layers.forEach(layer => {
        if (options.force) {
          this.webContext.clear(current);
        }
        if (!this.webContext.has(layer)) {
          this.visit(data, layer, current, 0, options);
        }
      });
    } else {
      if (options.force) {
        this.webContext.clear(current);
      }
      if (!this.webContext.has(current)) {
        this.visit(data, current, current, 0, options);
      }
    }
  }

  private visit(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number,
    options: WebBlocGenOptions
  ) {
    this.putOpenGroup(current, root, depth, options);
    this.putCloseGroup(current, root, data, depth, options);
  }

  private traverseLayer(
    current: SketchMSLayer,
    root: SketchMSLayer,
    data: SketchMSData,
    depth: number,
    options: WebBlocGenOptions
  ) {
    if (this.layer.identify(current)) {
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

      const tagName = options.jsx
        ? this.format.componentName(current.name)
        : `${options.xmlPrefix}${this.format.normalizeName(current.name)}`;

      this.webContext.put(root, {
        components: [...this.webContext.of(root).components, current.name]
      });

      return this.format.indent(depth, `<${tagName}></${tagName}>`);
    }
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
    return '';
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

    return this.format.indent(depth, tag);
  }

  private extractText(current: SketchMSLayer, depth: number) {
    const content = this.text.lookup(current);
    const tag = `<span>${content}</span>`;

    return this.format.indent(depth, tag);
  }

  private extractShape(current: SketchMSLayer, depth: number) {
    return this.svgBlocGen
      .render(current, { xmlNamespace: false })
      .map(file => {
        return file.value
          .split('\n')
          .map(line => this.format.indent(depth, line))
          .join('\n');
      })
      .join('\n');
  }

  private putOpenGroup(
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number,
    options: WebBlocGenOptions
  ) {
    const attributes = this.extractTagAttributes(current, options);
    const tag = ['<div', ...attributes].join(' ') + '>';

    this.webContext.put(root, {
      html: this.renderHtmlBuild([
        this.webContext.of(root).html,
        this.format.indent(depth, tag)
      ])
    });
  }

  private putCloseGroup(
    current: SketchMSLayer,
    root: SketchMSLayer,
    data: SketchMSData,
    depth: number,
    options: WebBlocGenOptions
  ) {
    const content = this.traverseLayer(current, root, data, depth + 1, options);
    if (content === '') {
      this.webContext.put(root, {
        html: `${this.webContext.of(root).html}</div>`
      });
    } else if (content) {
      this.webContext.put(root, {
        html: this.renderHtmlBuild([
          this.webContext.of(root).html,
          content,
          this.format.indent(depth, '</div>')
        ])
      });
    } else {
      this.webContext.put(root, {
        html: this.renderHtmlBuild([
          this.webContext.of(root).html,
          this.format.indent(depth, '</div>')
        ])
      });
    }
  }

  private extractTagAttributes(
    current: SketchMSLayer,
    options: WebBlocGenOptions
  ) {
    const className = this.cssBlocGen.context(current).className;
    return [
      ...(className
        ? [`${options.jsx ? 'className' : 'class'}="${className}"`]
        : []),
      `role="${current._class}"`,
      `aria-label="${current.name}"`
    ];
  }

  private renderHtmlBuild(html: string[]) {
    return html.filter(s => !!s).join('\n');
  }
}
