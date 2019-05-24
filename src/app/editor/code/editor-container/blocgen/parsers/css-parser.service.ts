import { Injectable } from "@angular/core";
import { ParserFacade, RessourceFile } from "../blocgen.d";
import { LintService } from "../lint.service";

export interface CssParserOptions {
  cssDist?: string;
}

@Injectable({
  providedIn: "root"
})
export class CssParserService implements ParserFacade {
  constructor(private readonly lintService: LintService) {}

  private cssDist: string;

  transform(
    _data: SketchMSData,
    current: SketchMSLayer,
    options: CssParserOptions = {}
  ) {
    this.cssDist = options.cssDist || "";

    if (this.getInfos(current)) {
      return [
        {
          kind: "css",
          language: "css",
          value: this.compute(current),
          uri: `${this.cssDist}${current.name}.css`
        } as RessourceFile
      ];
    }
    return [];
  }

  identify(current: SketchMSLayer) {
    return !!current.style;
  }

  getInfos(current: SketchMSLayer) {
    const isLegacyCss =
      current.css && (!current.css.rule && !current.css.className);

    return {
      rules: current.css,
      className: isLegacyCss
        ? (current as any).css__className
        : (current as any).className
    };
  }

  private compute(current: SketchMSLayer) {
    const rules = this.getInfos(current).rules;

    return Object.entries(rules)
      .map(([key, value]) => this.lintService.indent(1, `${key}: ${value};`))
      .join("\n");
  }
}
