import { Injectable } from "@angular/core";
import { FormatService } from "@xlayers/std-blocgen";
import { SvgBlocGenOptions } from "./svg-blocgen.service";
import {
  SvgBlocGenContext,
  SvgContextService,
  SvgBlocGenContextPath
} from "./svg-context.service";
import { CssContextService } from "@xlayers/css-blocgen";

@Injectable({
  providedIn: "root"
})
export class SvgRenderService {
  constructor(
    private formatHelperService: FormatService,
    private cssContextService: CssContextService,
    private svgContextService: SvgContextService
  ) {}

  render(
    _data: SketchMSData,
    current: SketchMSLayer,
    _opts?: SvgBlocGenOptions
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
      `style="${[
        "position: absolute",
        `top: ${-context.offset}px`,
        `left: ${-context.offset}px`
      ].join("; ")}"`,
      `width="${current.frame.width + context.offset * 2}"`,
      `height="${current.frame.height + context.offset * 2}"`,
      `role="img"`
    ].join(" ");

    return [
      `<svg ${attributes}>`,
      context.paths.map(path =>
        this.formatHelperService.indent(
          1,
          this.renderPath(path)
        )
      ),
      `</svg>`
    ].join("\n");
  }

  private renderPath(path: SvgBlocGenContextPath) {
    return `<${path.type} ${path.attributes.join(" ")}/>`;
  }
}