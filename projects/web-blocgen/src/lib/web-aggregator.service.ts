import { Injectable } from '@angular/core';
import {
  FormatService,
  SymbolService,
  LayerService,
  ImageService,
  TextService
} from '@xlayers/sketch-lib';
import { WebContextService } from './web-context.service';
import { WebBlocGenOptions } from './web-blocgen';
import { CssBlocGenService } from '@xlayers/css-blocgen';
import { SvgBlocGenService } from '@xlayers/svg-blocgen';

@Injectable({
  providedIn: 'root'
})
export class WebAggregatorService {
  constructor(
    private textService: TextService,
    private readonly symbolService: SymbolService,
    private readonly imageService: ImageService,
    private formatService: FormatService,
    private readonly layerService: LayerService,
    private readonly webContext: WebContextService,
    private cssBlocGen: CssBlocGenService,
    private svgBlocGen: SvgBlocGenService
  ) {}

  aggreate(current: SketchMSLayer, options: WebBlocGenOptions) {
    const fileName = this.formatService.normalizeName(current.name);
    return [
      {
        kind: 'web',
        value: this.renderComponent(current, options),
        language: 'html',
        uri: `${options.componentDir}/${fileName}.html`
      },
      ...this.cssBlocGen.aggreate(current, options).map(file => ({
        ...file,
        kind: 'web'
      }))
    ];
  }

  private renderComponent(current: SketchMSLayer, options: WebBlocGenOptions) {
    const template = [];

    if (current._class === 'page') {
      this.walk(current, template, 0, options);
    } else {
      this.visit(current, template, 0, options);
    }

    return template.join('\n');
  }

  private walk(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebBlocGenOptions
  ) {
    if (this.layerService.identify(current)) {
      current.layers.forEach(layer => {
        this.visit(layer, template, indent, options);
      });
    }
  }

  private visit(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebBlocGenOptions
  ) {
    if (this.symbolService.identify(current)) {
      this.visitSymbol(current, template, indent, options);
    } else if (this.imageService.identify(current)) {
      this.visitBitmap(current, template, indent, options);
    } else if (this.textService.identify(current)) {
      this.visitText(current, template, indent, options);
    } else if (this.svgBlocGen.identify(current)) {
      this.visitShape(current, template, indent, options);
    } else if (this.webContext.identify(current)) {
      this.visitLayer(current, template, indent, options);
    }
  }

  private visitLayer(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebBlocGenOptions
  ) {
    const openTag = this.renderAttributeTag(
      current,
      options.blockTagName,
      options
    );
    const closeTag = `</${options.blockTagName}>`;

    template.push(this.formatService.indent(indent, openTag));
    this.walk(current, template, indent + 1, options);
    template.push(this.formatService.indent(indent, closeTag));
  }

  private visitSymbol(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebBlocGenOptions
  ) {
    const tagName = options.jsx
      ? this.formatService.className(current.name)
      : `${options.xmlPrefix}${this.formatService.normalizeName(current.name)}`;
    template.push(
      this.formatService.indent(indent, `<${tagName}></${tagName}>`)
    );
  }

  private visitBitmap(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebBlocGenOptions
  ) {
    const attributes = this.webContext.of(current).attributes;
    template.push(
      this.formatService.indent(
        indent,
        [`<${options.bitmapTagName}`, ...attributes].join(' ') + ' />'
      )
    );
  }

  private visitText(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebBlocGenOptions
  ) {
    template.push(
      this.formatService.indent(
        indent,
        [
          this.renderAttributeTag(current, options.textTagName, options),
          this.textService.lookup(current),
          `</${options.textTagName}>`
        ].join('')
      )
    );
  }

  private visitShape(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebBlocGenOptions
  ) {
    template.push(
      this.formatService.indent(
        indent,
        this.renderAttributeTag(current, options.blockTagName, options)
      )
    );
    template.push(
      this.svgBlocGen
        .aggreate(current, { xmlNamespace: false })
        .map(file =>
          file.value
            .split('\n')
            .map(line => this.formatService.indent(indent + 1, line))
            .join('\n')
        )
        .join('\n')
    );
    template.push(
      this.formatService.indent(indent, `</${options.blockTagName}>`)
    );
  }

  private renderAttributeTag(
    current: SketchMSLayer,
    tagName: string,
    options: WebBlocGenOptions
  ) {
    const attributes = this.webContext.of(current).attributes;
    if (options.jsx) {
      const attributIndex = attributes.findIndex(attribute =>
        attribute.startsWith('class=')
      );
      if (attributIndex > 0) {
        attributes[attributIndex] = attributes[attributIndex].replace(
          'class=',
          'className='
        );
      }
    }
    return [`<${tagName}`, ...attributes].join(' ') + '>';
  }
}
