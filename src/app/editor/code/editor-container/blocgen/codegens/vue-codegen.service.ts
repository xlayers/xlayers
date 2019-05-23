import { Injectable } from "@angular/core";
import { XlayersNgxEditorModel } from "../../codegen/codegen.service";
import { CodeGenRessourceFile, CodeGenFacade } from '../blocgen';
import { WebParserService } from "../parsers/web-parser.service";

const readmeTemplate = () => `
## How to use the Xlayers Vuejs module

1. Download and extract the exported module into your workspace,

2. Import the component into your App component or other container.
\`\`\`
<template>
  <div id="app">
    <Xlayers />
  </div>
</template>

<script>
import Xlayers from './xlayers/Xlayers.vue'

export default {
  name: 'app',
  components: {
    Xlayers
  }
}
</script>
\`\`\`

3. Enjoy.`;

const componentSpecTemplate = (name: string) => {
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

  return `\
import { shallowMount } from "@vue/test-utils";
import ${capitalizedName} from "@/components/${name}.vue";
import { componentSpecTemplate } from '../codegen/vue/vue.template';
import { SketchMSData } from '../../../../core/sketch.service';

describe("${capitalizedName}", () => {
  it("render", () => {
    const wrapper = shallowMount(${capitalizedName}, {});
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});`;
};

const componentTemplate = (html: string, css: string) => `\
<template>
${html}
</template>

<script>
export default {}
</script>

<style>
${css}
</style>
`;

@Injectable({
  providedIn: "root"
})
export class VueCodeGenService implements CodeGenFacade {
  constructor(private readonly webParserService: WebParserService) {}

  buttons() {
    return {};
  }

  generate(data: SketchMSData) {
    const files = (data.pages as any).flatMap(page =>
      this.transform(data, page)
    );

    return [
      {
        kind: "vue",
        value: readmeTemplate(),
        language: "markdown",
        uri: `README.md`
      },
      ...files
    ] as XlayersNgxEditorModel[];
  }

  transform(data: SketchMSData, current: SketchMSLayer, options?: any) {
    if (this.webParserService.identify(current)) {
      return (this.webParserService.transform(data, current) as any).flatMap(
        file => this.transformWebFile(file)
      );
    }
    return [];
  }

  transformWebFile(file: CodeGenRessourceFile) {
    if (file.kind === "web" && file.language === "html") {
      return this.transformWebHtmlFile(file);
    }

    return [
      {
        ...file,
        kind: "vue",
        uri: `assets/${file.uri}`
      }
    ];
  }

  transformWebHtmlFile(file: CodeGenRessourceFile) {
    const filename = file.uri
      .split(".")
      .slice(0, -1)
      .join(".");

    return [
      {
        ...file,
        kind: "vue",
        value: componentTemplate(file.value, ""),
        uri: `components/${filename}.vue`
      },
      {
        ...file,
        kind: "vue",
        value: componentSpecTemplate(filename),
        language: "javascript",
        uri: `components/${filename}.spec.js`
      }
    ];
  }
}
