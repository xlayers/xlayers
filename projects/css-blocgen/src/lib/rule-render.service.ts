import { Injectable } from "@angular/core";
import { FormatService } from "@xlayers/sketch-lib";
import { CssContextService, CssBlocGenContext } from "./css-context.service";

export interface CssRenderOptions {
  className: string;
}

@Injectable({
  providedIn: "root"
})
export class RuleRenderService {
  constructor(
    private cssContext: CssContextService,
    private format: FormatService
  ) {}

  render(
    current: SketchMSLayer,
    options: CssRenderOptions = { className: null }
  ) {
    const context = this.cssContext.contextOf(current);
    return [
      {
        kind: "css",
        language: "css",
        value: this.renderFile(context, options),
        uri: `${this.format.snakeName(current.name)}.css`
      }
    ];
  }

  private renderFile(context: CssBlocGenContext, options: CssRenderOptions) {
    const rules = this.rulesIntoKeyValue(context);

    if (options.className) {
      return [
        `${options.className} {`,
        ...rules.map(rule => this.format.indent(1, rule)),
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
