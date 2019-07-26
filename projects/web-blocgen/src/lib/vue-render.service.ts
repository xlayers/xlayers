import { Injectable } from "@angular/core";
import { ResourceService, FormatService } from "@xlayers/sketch-lib";
import { WebOptimizerService } from "./web-optimizer.service";
import { WebContextService } from "./web-context.service";
import { WebBlocGenContext, WebBlocGenOptions } from "./web-blocgen.d";

@Injectable({
  providedIn: "root"
})
export class VueRenderService {
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
      ...this.traverse(current, data, options).map(file => ({
        ...file,
        kind: "vue"
      })),
      {
        kind: "vue",
        value: this.renderComponent(current, context, options).join("\n"),
        language: "html",
        uri: `${options.componentDir}/${name}.vue`
      },
      {
        kind: "vue",
        value: this.renderSpec(name, options).join("\n"),
        language: "javascript",
        uri: `${options.componentDir}/${name}.spec.js`
      }
    ];
  }

  private traverse(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    if (this.webContext.identify(current)) {
      return (current.layers as any).flatMap(layer =>
        this.traverse(layer, data, options)
      );
    }
    return this.retrieveFiles(current, data, options);
  }

  private retrieveFiles(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    if (this.resource.identifySymbolInstance(current)) {
      return this.retrieveSymbolMaster(current, data, options);
    }
    if (this.resource.identifyBitmap(current)) {
      return this.retrieveBitmap(current, data, options);
    }
    return [];
  }

  private retrieveSymbolMaster(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    const symbolMaster = this.resource.lookupSymbolMaster(current, data);

    if (symbolMaster) {
      return this.render(symbolMaster, data, options);
    }

    return [];
  }

  private retrieveBitmap(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    const image = this.lookupImage(current, data);

    return [
      {
        kind: "vue",
        value: image,
        language: "binary",
        uri: `${options.assetDir}/${this.format.normalizeName(
          current.name
        )}.jpg`
      }
    ];
  }
  private renderComponent(
    current: SketchMSLayer,
    context: WebBlocGenContext,
    options: WebBlocGenOptions
  ) {
    return [
      "<template>",
      ...context.html,
      "</template>",
      "",
      "<script>",
      ...this.renderScript(context.components, options),
      "</script>",
      "",
      "<style>",
      this.webOptimizer.optimize(current),
      "</style>"
    ];
  }

  private renderScript(components: string[], options: WebBlocGenOptions) {
    const importStatements = components.map(component =>
      this.renderImport(component, options)
    );

    const moduleNames = components.reduce(
      (acc, component) => {
        acc.push(`,\n    ${component}`);
        return acc;
      },
      [`    ${components[0]}`]
    );

    if (components.length > 0) {
      return [
        ...importStatements,
        "",
        "export default {",
        "  components: {",
        ...moduleNames,
        "  }",
        "}"
      ];
    }

    return ["export default {}"];
  }

  private renderSpec(name: string, options: WebBlocGenOptions) {
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    const importPath = [options.componentDir, name].join("/");

    return [
      'import { shallowMount } from "@vue/test-utils";',
      `import ${capitalizedName} from "./${importPath}";`,
      "",
      `describe("${capitalizedName}", () => {`,
      '  it("render", () => {',
      `    const wrapper = shallowMount(${capitalizedName}, {});`,
      "    expect(wrapper.isVueInstance()).toBeTruthy();",
      "  });",
      "});"
    ];
  }

  private renderImport(name, options) {
    return `import ${name} from "${[options.componentDir, name].join("/")}"`;
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
