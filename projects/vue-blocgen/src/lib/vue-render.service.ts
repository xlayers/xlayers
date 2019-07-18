import { Injectable } from "@angular/core";
import { VueContextService, VueBlocGenContext } from "./vue-context.service";
import { CssRenderService } from "./css-render.service";
import { ResourceService, FormatService } from "@xlayers/sketch-util";
import { VueBlocGenOptions } from "@xlayers/vue-blocgen";

@Injectable({
  providedIn: "root"
})
export class VueRenderService {
  constructor(
    private formatService: FormatService,
    private resourceService: ResourceService,
    private vueContextService: VueContextService,
    private cssRenderService: CssRenderService
  ) {}

  render(
    current: SketchMSLayer,
    data: SketchMSData,
    options: VueBlocGenOptions
  ) {
    const name = this.formatService.normalizeName(current.name);
    const context = this.vueContextService.contextOf(current);

    return [
      ...this.traverse(data, current, options).map(file => ({
        ...file,
        kind: "vue"
      })),
      {
        kind: "vue",
        value: this.renderComponent(current, context, options),
        language: "html",
        uri: `${options.componentDir}/${name}.vue`
      },
      {
        kind: "vue",
        value: this.renderComponentSpec(name, options),
        language: "javascript",
        uri: `${options.componentDir}/${name}.spec.js`
      }
    ];
  }

  private traverse(
    data: SketchMSData,
    current: SketchMSLayer,
    options: VueBlocGenOptions
  ) {
    if (this.vueContextService.identify(current)) {
      return (current.layers as any).flatMap(layer =>
        this.traverse(data, layer, options)
      );
    }
    return this.retrieveFiles(data, current, options);
  }

  private retrieveFiles(
    data: SketchMSData,
    current: SketchMSLayer,
    options: VueBlocGenOptions
  ) {
    if (this.resourceService.identifySymbolInstance(current)) {
      return this.retrieveSymbolMaster(data, current, options);
    }
    if (this.resourceService.identifyBitmap(current)) {
      return this.retrieveBitmap(data, current, options);
    }
    return [];
  }

  private retrieveSymbolMaster(
    data: SketchMSData,
    current: SketchMSLayer,
    options: VueBlocGenOptions
  ) {
    const symbolMaster = this.resourceService.lookupSymbolMaster(current, data);

    if (symbolMaster) {
      return this.render(symbolMaster, data, options);
    }

    return [];
  }

  private retrieveBitmap(
    data: SketchMSData,
    current: SketchMSLayer,
    options: VueBlocGenOptions
  ) {
    const image = this.lookupImage(current, data);

    return [
      {
        kind: "vue",
        value: image,
        language: "binary",
        uri: `${options.assetDir}/${this.formatService.normalizeName(
          current.name
        )}.jpg`
      }
    ];
  }

  private renderComponentSpec(name: string, options: VueBlocGenOptions) {
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

    return [
      'import { shallowMount } from "@vue/test-utils";',
      `import ${capitalizedName} from "@/${[options.componentDir, name].join(
        "/"
      )}.vue";`,
      "",
      'describe("${capitalizedName}", () => {',
      '  it("render", () => {',
      "    const wrapper = shallowMount(${capitalizedName}, {});",
      "    expect(wrapper.isVueInstance()).toBeTruthy();",
      "  });",
      "});"
    ].join("\n");
  }

  private renderComponent(
    current: SketchMSLayer,
    context: VueBlocGenContext,
    options: VueBlocGenOptions
  ) {
    return [
      "<template>",
      context.html.join("\n"),
      "</template>",
      "",
      "<script>",
      this.renderScript(context.components, options),
      "</script>",
      "",
      "<style>",
      this.cssRenderService.render(current),
      "</style>"
    ].join("\n");
  }

  private renderScript(components: string[], options: VueBlocGenOptions) {
    const importStatements = components.map(
      component =>
        `import ${component} from "${[options.componentDir, component].join(
          "/"
        )}"`
    );

    if (components.length > 0) {
      return [
        ...importStatements,
        "",
        "export default {",
        "  components: {",
        `    ${components.join(",\n    ")}`,
        "  }",
        "}"
      ].join("\n");
    }

    return "export default {}";
  }

  private lookupImage(current: SketchMSLayer, data: SketchMSData) {
    const content = this.resourceService.lookupBitmap(current, data);
    const bin = atob(content);
    const buf = new Uint8Array(bin.length);
    Array.prototype.forEach.call(bin, (ch, i) => {
      buf[i] = ch.charCodeAt(0);
    });
    return buf;
  }
}
