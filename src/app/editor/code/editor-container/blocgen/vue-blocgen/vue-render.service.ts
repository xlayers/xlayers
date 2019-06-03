import { Injectable } from "@angular/core";
import { VueBlocGenOptions } from "./vue-blocgen.service";
import { VueContextService, VueBlocGenContext } from "./vue-context.service";

const COMPONENTS_DIR = "components";

@Injectable({
  providedIn: "root"
})
export class VueRenderService {
  constructor(private readonly vueContextService: VueContextService) {}

  render(
    _data: SketchMSData,
    current: SketchMSLayer,
    _options: VueBlocGenOptions = {}
  ) {
    if (this.vueContextService.hasContext(current)) {
      const context = this.vueContextService.contextOf(current);
      return [
        {
          kind: "vue",
          value: this.formatContext(context),
          language: "html",
          uri: `${COMPONENTS_DIR}/${current.name}.vue`
        },
        {
          kind: "vue",
          value: this.renderComponentSpec(`${COMPONENTS_DIR}/${current.name}`),
          language: "javascript",
          uri: `${COMPONENTS_DIR}/${current.name}.spec.js`
        }
      ];
    }

    return [];
  }

  private renderComponentSpec(path: string) {
    const capitalizedName = path.charAt(0).toUpperCase() + path.slice(1);

    return `\
import { shallowMount } from "@vue/test-utils";
import ${capitalizedName} from "@/components/${path}.vue";
import { componentSpecTemplate } from '../codegen/vue/vue.template';
import { SketchMSData } from '../../../../core/sketch.service';

describe("${capitalizedName}", () => {
  it("render", () => {
    const wrapper = shallowMount(${capitalizedName}, {});
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});`;
  }

  private formatContext(context: VueBlocGenContext) {
    return `\
<template>
${context.html.join("\n")}
</template>

<script>
${this.renderScript(context.components)}
</script>

<style>
${context.css.join("\n\n")}
</style>`;
  }

  private renderScript(components: string[]) {
    const imports = components
      .map(component => `import ${component} from "components/${component}"`)
      .join("\n");

    return components.length === 0
      ? `\
export default {}`
      : `\
${imports}

export default {
  components: {
    ${components.join(",\n    ")}
  }
}`;
  }
}
