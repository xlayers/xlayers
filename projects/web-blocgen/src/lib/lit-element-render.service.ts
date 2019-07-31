import { Injectable } from "@angular/core";
import { FormatService } from "@xlayers/sketch-lib";
import { WebRenderService } from "./web-render.service";
import { WebBlocGenOptions } from "./web-blocgen";

@Injectable({
  providedIn: "root"
})
export class LitElementRenderService {
  constructor(
    private format: FormatService,
    private webRender: WebRenderService
  ) {}

  render(current: SketchMSLayer, options: WebBlocGenOptions) {
    const name = this.format.snakeName(current.name);
    const files = this.webRender.render(current, options);
    const html = files.find(file => file.kind === "html");
    const css = files.find(file => file.kind === "css");

    return [
      {
        kind: "web",
        value: this.renderComponent(name, html.value, css.value),
        language: "html",
        uri: `${options.componentDir}/${name}.html`
      }
    ];
  }

  private renderComponent(name: string, html: string, css: string) {
    return [
      "import { LitElement, html, css } from 'lit-element';",
      "",
      `class ${name} extends LitElement {`,
      "",
      "  static get styles() {",
      "    return css`",
      ...this.format.indentFile(3, css),
      "    `",
      "  }",
      "",
      "  render(){",
      "    return html`",
      ...this.format.indentFile(3, html),
      "    `",
      "  }",
      "}",
      "",
      "customElements.define('x-layers-element' , XLayersElement);"
    ].join("\n");
  }
}
