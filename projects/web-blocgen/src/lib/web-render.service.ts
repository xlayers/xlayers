import { Injectable } from "@angular/core";
import { FormatService } from "@xlayers/sketch-lib";
import { CssBlocGenService } from "@xlayers/css-blocgen";
import { WebContextService } from "./web-context.service";
import { WebBlocGenOptions } from "./web-blocgen";

@Injectable({
  providedIn: "root"
})
export class WebRenderService {
  constructor(
    private format: FormatService,
    private webContext: WebContextService,
    private cssBlocGen: CssBlocGenService
  ) {}

  render(current: SketchMSLayer, options: WebBlocGenOptions) {
    const name = this.format.snakeName(current.name);
    const context = this.webContext.contextOf(current);

    return [
      {
        kind: "web",
        value: context.html.join("\n"),
        language: "html",
        uri: `${options.componentDir}/${name}.html`
      },
      {
        kind: "web",
        value: this.cssBlocGen.transform(current),
        language: "css",
        uri: `${options.componentDir}/${name}.css`
      }
    ];
  }
}
