import { Injectable } from '@angular/core';
import {
  FormatService,
  SymbolService,
  LayerService,
  ImageService,
  TextService
} from '@xlayers/sketch-lib';
import { WebContextService } from './web-context.service';
import { CssCodeGenService } from '@xlayers/css-codegen';
import { SvgCodeGenService } from '@xlayers/svg-codegen';
import { WebCodeGenOptions } from './web-codegen';

@Injectable({
  providedIn: 'any'
})
export class WebAggregatorService {
  constructor(
    private readonly textService: TextService,
    private readonly symbolService: SymbolService,
    private readonly imageService: ImageService,
    private readonly layerService: LayerService,
    private readonly cssCodeGen: CssCodeGenService,
    private readonly formatService: FormatService,
    private readonly webContext: WebContextService,
    private readonly svgCodeGen: SvgCodeGenService
  ) {}

  aggregate(current: SketchMSLayer, options: WebCodeGenOptions) {
    const fileName = this.formatService.normalizeName(current.name);
    return [
      {
        kind: 'web',
        value: this.renderComponent(current, options),
        language: 'html',
        uri: `${options.componentDir}/${fileName}.html`
      },
      ...this.cssCodeGen.aggregate(current, options).map(file => ({
        ...file,
        kind: 'web'
      }))
    ];
  }

  private renderComponent(current: SketchMSLayer, options: WebCodeGenOptions) {
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
    options: WebCodeGenOptions
  ) {
    if (this.layerService.identify(current)) {
      current?.layers?.forEach(layer => {
        this.visit(layer, template, indent, options);
      });
    }
  }

  private visit(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebCodeGenOptions
  ) {
    if (current.web?.tag?.name) {
      options = {
        ...options,
        tagName: current.web.tag.name
      };
    }

    if (this.symbolService.identify(current)) {
      this.visitSymbol(current, template, indent, options);
    } else if (this.imageService.identify(current)) {
      this.visitBitmap(current, template, indent, options);
    } else if (this.textService.identify(current)) {
      this.visitText(current, template, indent, options);
    } else if (this.svgCodeGen.identify(current)) {
      this.visitShape(current, template, indent, options);
    } else if (this.webContext.identify(current)) {
      this.visitLayer(current, template, indent, options);
    }
  }

  private visitLayer(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebCodeGenOptions
  ) {
    const openTag = this.renderAttributeTag(current, options.tagName, options);
    const closeTag = `</${options.tagName}>`;

    template.push(this.formatService.indent(indent, openTag));
    this.walk(current, template, indent + 1, options);
    template.push(this.formatService.indent(indent, closeTag));
  }

  private visitSymbol(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebCodeGenOptions
  ) {
    const context = this.webContext.of(current);

    if (context?.components?.length > 1) {
      const tagName = options.jsx
        ? this.formatService.className(current.name)
        : `${options.xmlPrefix}${this.formatService.normalizeName(
            current.name
          )}`;
      template.push(
        this.formatService.indent(indent, `<${tagName}></${tagName}>`)
      );
    }
  }

  private visitBitmap(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebCodeGenOptions
  ) {
    const attributes = this.webContext.of(current)?.attributes ?? [];
    template.push(
      this.formatService.indent(
        indent,
        [`<${options.tagName}`, ...attributes].join(' ') + ' />'
      )
    );
  }

  private visitText(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebCodeGenOptions
  ) {
    template.push(
      this.formatService.indent(
        indent,
        [
          this.renderAttributeTag(current, options.tagName, options),
          this.textService.lookup(current as SketchMSTextLayer),
          `</${options.tagName}>`
        ].join('')
      )
    );
  }

  private visitShape(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebCodeGenOptions
  ) {
    template.push(
      this.formatService.indent(
        indent,
        this.renderAttributeTag(current, options.tagName, options)
      )
    );
    template.push(
      this.svgCodeGen
        .aggregate(current, { xmlNamespace: false })
        .map(file =>
          file.value
            .split('\n')
            .map(line => this.formatService.indent(indent + 1, line))
            .join('\n')
        )
        .join('\n')
    );
    template.push(this.formatService.indent(indent, `</${options.tagName}>`));
  }

  private renderAttributeTag(
    current: SketchMSLayer,
    tagName: string,
    options: WebCodeGenOptions
  ) {
    const attributes = this.webContext.of(current)?.attributes;
    if (options.jsx) {
      const attributIndex = attributes?.findIndex((attribute: string) =>
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
