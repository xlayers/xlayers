import { Injectable } from "@angular/core";
import { FormatService } from "@xlayers/sketch-lib";
import { CssContextService, CssBlocGenContext } from "./css-context.service";

export interface CssRenderOptions {
  className: string;
}

@Injectable({
  providedIn: "root"
})
export class CssRenderService {
  constructor(
    private cssContextService: CssContextService,
    private formatService: FormatService
  ) {}

  render(
    current: SketchMSLayer,
    options: CssRenderOptions = { className: null }
  ) {
    const context = this.cssContextService.contextOf(current);
    return [
      {
        kind: "css",
        language: "css",
        value: this.renderFile(context, options),
        uri: `${this.formatService.normalizeName(current.name)}.css`
      }
    ];
  }

  private renderFile(context: CssBlocGenContext, options: CssRenderOptions) {
    const rules = this.rulesIntoKeyValue(context);

    if (options.className) {
      return [
        `${options.className} {`,
        ...rules.map(rule => this.formatService.indent(1, rule)),
        "}"
      ].join("\n");
    }

    return rules.join("\n");
  }

  private rulesIntoKeyValue(context: CssBlocGenContext) {
    return Object.entries(context.rules).map(
      ([key, value]) => `${key}: ${value};`
    );
  }
}
