import { Injectable } from "@angular/core";
import { FormatService } from "@xlayers/sketch-lib";
import { WebBlocGenOptions } from "./web-blocgen";
import { WebRenderService } from "./web-render.service";

@Injectable({
  providedIn: "root"
})
export class WebComponentRenderService {
  constructor(
    private format: FormatService,
    private webRender: WebRenderService
  ) {}

  render(current: SketchMSLayer, options: WebBlocGenOptions) {
    const name = this.format.snakeName(current.name);
    const files = this.webRender.render(current, options);
    const html = files.find(file => file.kind === "html");

    return [
      files.filter(file => file.kind !== "html"),
      {
        kind: "wc",
        value: this.renderComponent(name, html.value).join("\n"),
        language: "javascript",
        uri: `${options.componentDir}/${name}.js`
      }
    ];
  }

  private renderComponent(name: string, html: string) {
    return [
      `class ${name} extends HTMLElement {`,
      `  static is = '${name}';`,
      "",
      "  render() {",
      ...this.format.indentFile(2, html),
      "  }",
      "}",
      "",
      `customElements.define(${name}.is , ${name});`
    ];
  }
}
