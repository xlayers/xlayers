import { Injectable } from "@angular/core";
import { ResourceService, FormatService } from "@xlayers/sketch-lib";
import { WebOptimizerService } from "./web-optimizer.service";
import { WebContextService } from "./web-context.service";
import { WebBlocGenContext, WebBlocGenOptions } from "./web-blocgen.d";

@Injectable({
  providedIn: "root"
})
export class ReactRenderService {
  constructor(
    private format: FormatService,
    private resource: ResourceService,
    private webContext: WebContextService,
    private webOptimizer: WebOptimizerService
  ) {}

  render(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    const name = this.format.normalizeName(current.name);
    const context = this.webContext.contextOf(current);

    return [
      ...this.traverse(data, current, options).map(file => ({
        ...file,
        kind: "react"
      })),
      {
        kind: "react",
        value: this.renderComponent(name, context, options).join("\n"),
        language: "javascript",
        uri: `${options.componentDir}/${name}.js`
      },
      {
        kind: "react",
        value: this.webOptimizer.optimize(current),
        language: "css",
        uri: `${options.componentDir}/${name}.css`
      },
      {
        kind: "react",
        value: this.renderSpec(name).join("\n"),
        language: "javascript",
        uri: `${options.componentDir}/${name}.js`
      }
    ];
  }

  private traverse(
    data: SketchMSData,
    current: SketchMSLayer,
    options: WebBlocGenOptions
  ) {
    if (this.webContext.identify(current)) {
      return (current.layers as any).flatMap(layer =>
        this.traverse(data, layer, options)
      );
    }
    return this.retrieveFiles(data, current, options);
  }

  private retrieveFiles(
    data: SketchMSData,
    current: SketchMSLayer,
    options: WebBlocGenOptions
  ) {
    if (this.resource.identifySymbolInstance(current)) {
      return this.retrieveSymbolMaster(data, current, options);
    }
    if (this.resource.identifyBitmap(current)) {
      return this.retrieveBitmap(data, current, options);
    }
    return [];
  }

  private retrieveSymbolMaster(
    data: SketchMSData,
    current: SketchMSLayer,
    options: WebBlocGenOptions
  ) {
    const symbolMaster = this.resource.lookupSymbolMaster(current, data);

    if (symbolMaster) {
      return this.render(symbolMaster, data, options);
    }

    return [];
  }

  private retrieveBitmap(
    data: SketchMSData,
    current: SketchMSLayer,
    options: WebBlocGenOptions
  ) {
    const image = this.lookupImage(current, data);

    return [
      {
        kind: "react",
        value: image,
        language: "binary",
        uri: `${options.assetDir}/${this.format.normalizeName(
          current.name
        )}.jpg`
      }
    ];
  }

  private renderComponent(
    name: string,
    context: WebBlocGenContext,
    options: WebBlocGenOptions
  ) {
    const importStatements = [
      "import React from 'react';",
      ...context.components.map(component =>
        this.renderImport(component, options)
      ),
      `import './${name}.css';`
    ];

    return [
      ...importStatements,
      "",
      `export const ${name} = () => (`,
      ...context.html.map(html => `  ${html}`),
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

  private renderImport(name, options) {
    return `import ${name} from "${[options.componentDir, name].join("/")}";`;
  }

  private lookupImage(current: SketchMSLayer, data: SketchMSData) {
    const content = this.resource.lookupBitmap(current, data);
    const bin = atob(content);
    const buf = new Uint8Array(bin.length);
    Array.prototype.forEach.call(bin, (ch, i) => {
      buf[i] = ch.charCodeAt(0);
    });
    return buf;
  }
}
