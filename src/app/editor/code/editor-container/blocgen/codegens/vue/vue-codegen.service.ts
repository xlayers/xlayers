import { Injectable } from "@angular/core";
import { XlayersNgxEditorModel } from "../../../codegen/codegen.service";
import { CodeGenFacade } from "../../blocgen";
import { VueParserService } from "../../parsers/vue-parser.service";

const readmeTemplate = (name: string) => `\
## How to use the ${name} Vuejs module

1. Download and extract the exported module into your workspace,

2. Import the component into your App component or other container.
\`\`\`
<template>
  <div id="app">
    <MyComponent />
  </div>
</template>

<script>
import MyComponent from './components/MyComponent.vue'

export default {
  name: 'app',
  components: {
    MyComponent
  }
}
</script>
\`\`\`

3. Enjoy.`;

@Injectable({
  providedIn: "root"
})
export class VueCodeGenService implements CodeGenFacade {
  constructor(private readonly vueParserService: VueParserService) {}

  buttons() {
    return {};
  }

  generate(data: SketchMSData) {
    return [
      {
        kind: "vue",
        value: readmeTemplate(data.meta.app),
        language: "markdown",
        uri: `README.md`
      },
      ...(data.pages as any).flatMap(page =>
        this.vueParserService.transform(data, page)
      )
    ] as XlayersNgxEditorModel[];
  }
}
