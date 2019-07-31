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
    const fileName = this.format.fileName(current.name);
    const files = this.webRender.render(current, options);
    const html = files.find(file => file.language === "html");

    return [
      files.filter(file => file.language !== "html"),
      {
        kind: "wc",
        value: this.renderComponent(name, html.value).join("\n"),
        language: "javascript",
        uri: `${options.componentDir}/${fileName}.js`
      }
    ];
  }

  private renderComponent(name: string, html: string) {
    const componentName = this.format.componentName(name);
    const tagName = this.format.fileName(name);

    return [
      `class ${componentName} extends HTMLElement {`,
      `  static is = '${tagName}';`,
      "",
      "  render() {",
      ...this.format.indentFile(2, html),
      "  }",
      "}",
      "",
      `customElements.define(${componentName}.is , ${componentName});`
    ];
  }
}
