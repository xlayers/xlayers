import { Injectable } from "@angular/core";
import { FormatService } from "@xlayers/sketch-lib";
import { WebRenderService } from "./web-render.service";
import { WebBlocGenOptions } from "./web-blocgen";
import { WebContextService } from "./web-context.service";

@Injectable({
  providedIn: "root"
})
export class ReactRenderService {
  constructor(
    private format: FormatService,
    private webContextService: WebContextService,
    private webRender: WebRenderService
  ) {}

  render(current: SketchMSLayer, options: WebBlocGenOptions) {
    const name = this.format.snakeName(current.name);
    const context = this.webContextService.contextOf(current);
    const files = this.webRender.render(current, options);
    const html = files.find(file => file.kind === "html");

    return [
      files.filter(file => file.kind !== "html"),
      {
        kind: "react",
        value: this.renderSpec(name).join("\n"),
        language: "javascript",
        uri: `${options.componentDir}/${name}.js`
      },
      {
        kind: "react",
        value: this.renderComponent(
          name,
          html.value,
          context.components,
          options
        ).join("\n"),
        language: "javascript",
        uri: `${options.componentDir}/${name}.jsx`
      }
    ];
  }

  private renderComponent(
    name: string,
    html: string,
    components: string[],
    options: WebBlocGenOptions
  ) {
    return [
      "import React from 'react';",
      ...components.map(
        component =>
          `import ${component} from "${options.componentDir}/${component}";`
      ),
      `import './${name}.css';`,
      "",
      `export const ${name} = () => (`,
      ...this.format.indentFile(1, html),
      ");",
      ""
    ];
  }

  private renderSpec(name: string) {
    return [
      "import React from 'react';",
      "import ReactDOM from 'react-dom';",
      `import ${name} from './${name}';`,
      "",
      "it('renders without crashing', () => {",
      "  const div = document.createElement('div');",
      `  ReactDOM.render(<${name} />, div);`,
      "  ReactDOM.unmountComponentAtNode(div);",
      "});"
    ];
  }
}
