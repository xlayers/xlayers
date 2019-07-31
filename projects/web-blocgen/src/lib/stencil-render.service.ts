import { Injectable } from "@angular/core";
import { FormatService } from "@xlayers/sketch-lib";
import { WebRenderService } from "./web-render.service";
import { WebBlocGenOptions } from "./web-blocgen";

@Injectable({
  providedIn: "root"
})
export class StencilRenderService {
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
        kind: "stencil",
        value: this.renderE2e(name).join("\n"),
        language: "typescript",
        uri: `${options.componentDir}/${name}.e2e.ts`
      },
      {
        kind: "stencil",
        value: this.renderComponent(html.value, options).join("\n"),
        language: "typescript",
        uri: `${options.componentDir}/${name}.tsx`
      }
    ];
  }

  private renderComponent(html: string, options: WebBlocGenOptions) {
    const capitalizedName = this.format.capitalizeName(name);

    return [
      "import { Component } from '@angular/core';",
      `import ${name} from "${options.componentDir}/${name}";`,
      "",
      "@Component({",
      `  selector: '${options.xmlPrefix}${name}',`,
      `  styleUrl: './${name}.component.css'`,
      "  shadow: true",
      "})",
      `export class ${capitalizedName}Component {`,
      "  render() {",
      "    return (",
      ...this.format.indentFile(3, html),
      "    );",
      "  }",
      "}"
    ];
  }

  private renderE2e(name: string) {
    return [
      `describe('${name}', () => {`,
      "  it('renders', async () => {",
      "    const page = await newE2EPage();",
      "",
      `    await page.setContent('<${name}></${name}>');`,
      `    const element = await page.find('${name}');`,
      `    expect(element).toHaveClass('hydrated');`,
      "  });",
      "});"
    ];
  }
}
