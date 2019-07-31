import { Injectable } from "@angular/core";
import { FormatService } from "@xlayers/sketch-lib";
import { CssRenderService } from "./css-render.service";
import { WebContextService } from "./web-context.service";
import { WebBlocGenOptions } from "./web-blocgen";

@Injectable({
  providedIn: "root"
})
export class WebRenderService {
  constructor(
    private format: FormatService,
    private webContext: WebContextService,
    private cssRender: CssRenderService
  ) {}

  render(current: SketchMSLayer, options: WebBlocGenOptions) {
    const fileName = this.format.fileName(current.name);
    const context = this.webContext.contextOf(current);

    return [
      {
        kind: "web",
        value: context.html.join("\n"),
        language: "html",
        uri: `${options.componentDir}/${fileName}.html`
      },
      {
        kind: "web",
        value: this.cssRender.render(current),
        language: "css",
        uri: `${options.componentDir}/${fileName}.css`
      }
    ];
  }
}
