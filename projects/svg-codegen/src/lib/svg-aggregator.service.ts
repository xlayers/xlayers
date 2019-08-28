import { Injectable } from '@angular/core';
import { FormatService } from '@xlayers/sketch-lib';
import { SvgContextService } from './svg-context.service';
import { SvgCodeGenOptions, SvgCodeGenContextPath } from './svg-codegen';

@Injectable({
  providedIn: 'root'
})
export class SvgAggregatorService {
  constructor(
    private formatService: FormatService,
    private svgContext: SvgContextService
  ) {}

  aggreate(current: SketchMSLayer, options: SvgCodeGenOptions) {
    const context = this.svgContext.of(current);
    return [
      {
        kind: 'svg',
        language: 'svg',
        value: this.renderFile(current, context.paths, context.offset, options),
        uri: `${this.formatService.normalizeName(current.name)}.svg`
      }
    ];
  }

  private renderFile(
    current: SketchMSLayer,
    paths: SvgCodeGenContextPath[],
    offset: number,
    options: SvgCodeGenOptions
  ) {
    const attributes = this.generateXmlAttribute(current, offset, options);
    const openTag = ['<svg', ...attributes].join(' ');
    return `\
${openTag}>
${paths
  .map(path =>
    this.formatService.indent(1, `<${path.type} ${path.attributes.join(' ')}/>`)
  )
  .join('\n')}
</svg>`;
  }

  private generateXmlAttribute(
    current: SketchMSLayer,
    offset: number,
    options: SvgCodeGenOptions
  ) {
    return [
      ...this.generateXmlHeaderAttribute(options),
      `width="${(current.frame.width + offset * 2).toFixed(2)}"`,
      `height="${(current.frame.height + offset * 2).toFixed(2)}"`
    ];
  }

  private generateXmlHeaderAttribute(options: SvgCodeGenOptions) {
    return options.xmlNamespace
      ? [
          'version="1.1"',
          `xmlns="http://www.w3.org/2000/svg"`,
          `xmlns:xlink="http://www.w3.org/1999/xlink"`
        ]
      : [];
  }
}
