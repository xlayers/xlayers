import { Injectable } from "@angular/core";
import { XlayersNgxEditorModel } from "../../codegen/codegen.service";
import { CodeGenRessourceFile, CodeGenFacade } from "../blocgen";
import { WebParserService } from "../parsers/web-parser.service";

const readmeTemplate = (name: string) => `\
## How to use the ${name} Vuejs module

1. Download and extract the exported module into your workspace,

2. Import the component into your App component or other container.
\`\`\`
<template>
  <div id="app">
    <${name} />
  </div>
</template>

<script>
import ${name} from './components/${name}.vue'

export default {
  name: 'app',
  components: {
    ${name}
  }
}
</script>
\`\`\`

3. Enjoy.`;

const componentSpecTemplate = (path: string) => {
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

export interface VueCodeGenOptions {}

@Injectable({
  providedIn: "root"
})
export class VueCodeGenService implements CodeGenFacade {
  constructor(private readonly webParserService: WebParserService) {}

  buttons() {
    return {};
  }

  generate(data: SketchMSData, options?: VueCodeGenOptions) {
    const files = (data.pages as any).flatMap(page =>
      this.transform(data, page, options)
    );

    return [
      {
        kind: "vue",
        value: readmeTemplate(data.meta.app),
        language: "markdown",
        uri: `README.md`
      },
      ...files
    ] as XlayersNgxEditorModel[];
  }

  transform(
    data: SketchMSData,
    current: SketchMSLayer,
    options?: VueCodeGenOptions
  ) {
    if (this.webParserService.identify(current)) {
      return (this.webParserService.transform(data, current, {
        assetDist: "assets",
        htmlDist: "components",
        ...options
      }) as any).flatMap(file => this.transformWebFile(file));
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
    const pathFilename = file.uri
      .split(".")
      .slice(0, -1)
      .join(".");

    return [
      {
        ...file,
        kind: "vue",
        value: componentTemplate(file.value, ""),
        uri: `${pathFilename}.vue`
      },
      {
        ...file,
        kind: "vue",
        value: componentSpecTemplate(pathFilename),
        language: "javascript",
        uri: `${pathFilename}.spec.js`
      }
    ];
  }
}
