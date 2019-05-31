import { Injectable } from "@angular/core";
import { FormatHelperService } from "../../format-helper.service";
import {
  SvgParserContext as SvgBlocGenContext,
  SvgParserOptions
} from "./svg-blocgen.service";
import { SvgContextService } from "./svg-context.service";

@Injectable({
  providedIn: "root"
})
export class SvgRenderService {
  constructor(
    private readonly formatHelperService: FormatHelperService,
    private readonly svgContextService: SvgContextService
  ) {}

  render(
    _data: SketchMSData,
    current: SketchMSLayer,
    _options?: SvgParserOptions
  ) {
    const context = this.svgContextService.contextOf(current);

    return [
      {
        kind: "svg",
        language: "svg",
        value: this.formatContext(context, current),
        uri: `${current.name}.svg`
      }
    ];
  }

  private formatContext(context: SvgBlocGenContext, current: SketchMSLayer) {
    const attributes = [
      `width="${current.frame.width + context.offset}"`,
      `height="${current.frame.height + context.offset}"`,
      `role="img"`
    ].join(" ");

    return [
      `<svg ${attributes}>`,
      this.formatHelperService.indent(1, context.paths),
      `</svg>`
    ].join("\n");
  }
}
