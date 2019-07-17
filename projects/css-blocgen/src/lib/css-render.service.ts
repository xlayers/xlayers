import { Injectable } from '@angular/core';
import { FormatService } from '@xlayers/std-library';
import { CssContextService, CssBlocGenContext } from './css-context.service';

@Injectable({
  providedIn: 'root'
})
export class CssRenderService {
  constructor(
    private cssContextService: CssContextService,
    private formatService: FormatService
  ) {}

  render(current: SketchMSLayer) {
    const context = this.cssContextService.contextOf(current);
    return [
      {
        kind: 'css',
        language: 'css',
        value: this.formatContext(context),
        uri: `${this.formatService.normalizeName(current.name)}.css`
      }
    ];
  }

  private formatContext(context: CssBlocGenContext) {
    return [
      `${context.className} {`,
      this.flattenAndIndentRules(context),
      '}'
    ].join('\n');
  }

  private flattenAndIndentRules(context: CssBlocGenContext) {
    return Object.entries(context.rules)
      .map(([key, value]) =>
        this.formatService.indent(1, `${key}: ${value};`)
      )
      .join('\n');
  }
}
