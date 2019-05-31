import { Injectable } from "@angular/core";
import { FormatHelperService } from "../../format-helper.service";
import { CssContextService } from "./css-context.service";

export interface CssParserContext {
  rules: { [key: string]: string };
  className: string;
}

export interface CssParserOptions {
  classNamePrefix?: string;
}

@Injectable({
  providedIn: "root"
})
export class CssRenderService {
  constructor(
    private readonly cssContextService: CssContextService,
    private readonly formatHelperService: FormatHelperService
  ) {}

  render(
    _data: SketchMSData,
    current: SketchMSLayer,
    _options: CssParserOptions = {}
  ) {
    if (this.cssContextService.hasContext(current)) {
      const context = this.cssContextService.contextOf(current);
      return [
        {
          kind: "css",
          language: "css",
          value: this.formatContext(context),
          uri: `${current.name}.css`
        }
      ];
    }

    return [];
  }

  private formatContext(context: CssParserContext) {
    return [
      `${context.className} {`,
      this.flattenAndIndentRules(context),
      "}"
    ].join("\n");
  }

  private flattenAndIndentRules(context: CssParserContext) {
    return Object.entries(context.rules)
      .map(([key, value]) =>
        this.formatHelperService.indent(1, `${key}: ${value};`)
      )
      .join("\n");
  }
}
