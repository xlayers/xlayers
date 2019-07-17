import { Injectable } from '@angular/core';
import { FormatService } from '@xlayers/std-library';
import {
  SvgBlocGenContext,
  SvgContextService,
  SvgBlocGenContextPath
} from './svg-context.service';

export interface SvgRenderOptions {
  xmlHeaders: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SvgRenderService {
  constructor(
    private formatService: FormatService,
    private svgContextService: SvgContextService
  ) {}

  render(
    current: SketchMSLayer,
    options: SvgRenderOptions = { xmlHeaders: true }
  ) {
    const context = this.svgContextService.contextOf(current);
    return [
      {
        kind: 'svg',
        language: 'svg',
        value: this.formatContext(context, current, options),
        uri: `${this.formatService.normalizeName(current.name)}.svg`
      }
    ];
  }

  private formatContext(
    context: SvgBlocGenContext,
    current: SketchMSLayer,
    options: SvgRenderOptions
  ) {
    const attributes = [
      ...this.maybeXmlHearder(options),
      `width="${current.frame.width + context.offset * 2}"`,
      `height="${current.frame.height + context.offset * 2}"`
    ].join(' ');

    return [
      `<svg ${attributes}>`,
      context.paths.map(path =>
        this.formatService.indent(1, this.renderPath(path))
      ),
      `</svg>`
    ].join('\n');
  }

  private maybeXmlHearder(options?: SvgRenderOptions) {
    if (options.xmlHeaders) {
      return [
        `xmlns="http://www.w3.org/2000/svg"`,
        `xmlns:xlink="http://www.w3.org/1999/xlink"`
      ];
    }
    return [];
  }

  private renderPath(path: SvgBlocGenContextPath) {
    return `<${path.type} ${path.attributes.join(' ')}/>`;
  }
}
