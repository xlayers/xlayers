import { Injectable } from '@angular/core';
import { FormatService } from '@xlayers/sketch-lib';
import {
  SvgBlocGenContext,
  SvgContextService,
  SvgBlocGenContextPath
} from './svg-context.service';
import { SvgBlocGenOptions } from '@xlayers/svg-blocgen';

@Injectable({
  providedIn: 'root'
})
export class SvgRenderService {
  constructor(
    private formatService: FormatService,
    private svgContextService: SvgContextService
  ) {}

  render(current: SketchMSLayer, options: SvgBlocGenOptions) {
    const context = this.svgContextService.contextOf(current);
    return [
      {
        kind: 'svg',
        language: 'svg',
        value: this.renderFile(context, current, options),
        uri: `${this.formatService.normalizeName(current.name)}.svg`
      }
    ];
  }

  private renderFile(
    context: SvgBlocGenContext,
    current: SketchMSLayer,
    options: SvgBlocGenOptions
  ) {
    const attributes = this.xmlHearderAttribute(context, current, options);
    return [
      ['<svg', ...attributes].join(' ') + '>',
      this.renderPaths(context),
      `</svg>`
    ].join('\n');
  }

  private xmlHearderAttribute(
    context: SvgBlocGenContext,
    current: SketchMSLayer,
    options: SvgBlocGenOptions
  ) {
    const defaultAttributes = [
      `width="${current.frame.width + context.offset * 2}"`,
      `height="${current.frame.height + context.offset * 2}"`
    ];

    if (options.xmlNamespace) {
      return [
        ...defaultAttributes,
        `xmlns="http://www.w3.org/2000/svg"`,
        `xmlns:xlink="http://www.w3.org/1999/xlink"`
      ];
    }

    return defaultAttributes;
  }

  private renderPaths(context: SvgBlocGenContext) {
    return context.paths.map(path =>
      this.formatService.indent(1, this.renderPath(path))
    );
  }
  private renderPath(path: SvgBlocGenContextPath) {
    return `<${path.type} ${path.attributes.join(' ')}/>`;
  }
}
