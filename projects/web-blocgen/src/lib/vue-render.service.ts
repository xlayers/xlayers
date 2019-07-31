import { Injectable } from "@angular/core";
import { FormatService } from "@xlayers/sketch-lib";
import { WebContextService } from "./web-context.service";
import { WebBlocGenOptions } from "./web-blocgen";
import { WebRenderService } from "./web-render.service";

@Injectable({
  providedIn: "root"
})
export class VueRenderService {
  constructor(
    private format: FormatService,
    private webContext: WebContextService,
    private webRender: WebRenderService
  ) {}

  render(current: SketchMSLayer, options: WebBlocGenOptions) {
    const name = this.format.snakeName(current.name);
    const context = this.webContext.contextOf(current);
    const files = this.webRender.render(current, options);
    const html = files.find(file => file.kind === "html");
    const css = files.find(file => file.kind === "css");

    return [
      {
        kind: "vue",
        value: this.renderSpec(name, options).join("\n"),
        language: "javascript",
        uri: `${options.componentDir}/${name}.spec.js`
      },
      {
        kind: "vue",
        value: this.renderComponent(
          html.value,
          css.value,
          context.components,
          options
        ).join("\n"),
        language: "html",
        uri: `${options.componentDir}/${name}.vue`
      }
    ];
  }

  private renderComponent(
    html: string,
    css: string,
    components: string[],
    options: WebBlocGenOptions
  ) {
    return [
      "<template>",
      html,
      "</template>",
      "",
      "<script>",
      ...this.renderScript(components, options),
      "</script>",
      "",
      "<style>",
      css,
      "</style>"
    ];
  }

  private renderScript(components: string[], options: WebBlocGenOptions) {
    const moduleNames = components.reduce(
      (acc, component) => {
        acc.push(`,\n    ${component}`);
        return acc;
      },
      [`    ${components[0]}`]
    );

    if (components.length > 0) {
      return [
        ...components.map(
          component =>
            `import ${component} from "${options.componentDir}/${component}"`
        ),
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
    const capitalizedName = this.format.capitalizeName(name);
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
}
