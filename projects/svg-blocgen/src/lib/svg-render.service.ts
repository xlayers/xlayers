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
      'style="position: absolute"',
      `top="${-context.offset}px"`,
      `left="${-context.offset}px"`,
      `width="${current.frame.width + context.offset}"`,
      `height="${current.frame.height + context.offset}"`,
      `role="img"`
    ].join(" ");

    const fillStyle = this.extractFillStyle(current);

    return [
      `<svg ${attributes}>`,
      context.paths.map(path =>
        this.formatHelperService.indent(
          1,
          this.renderPath({
            ...path,
            attributes: [...path.attributes, fillStyle]
          })
        )
      ),
      `</svg>`
    ].join("\n");
  }

  private renderPath(path: SvgBlocGenContextPath) {
    return `<${path.type} ${path.attributes.join(" ")}/>`;
  }

  private extractFillStyle(current: SketchMSLayer) {
    if (this.cssContextService.hasContext(current)) {
      const context = this.cssContextService.contextOf(current);
      if (context.rules.hasOwnProperty("background-color")) {
        return `fill="${context.rules["background-color"]}"`;
      }
    }
    return 'fill="none"';
  }
}
