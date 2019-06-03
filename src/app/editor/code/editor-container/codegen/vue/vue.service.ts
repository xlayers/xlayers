import { Injectable } from "@angular/core";
import { XlayersNgxEditorModel } from "../codegen.service";
import { CodeGenFacade } from "../../blocgen/blocgen";
import { VueBlocGenService } from "../../blocgen/vue-blocgen/vue-blocgen.service";

const renderReadme = (name: string) => `\
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
  constructor(private readonly vueBlocGenService: VueBlocGenService) {}

  buttons() {
    return {};
  }

  generate(data: SketchMSData) {
    return [
      {
        kind: "vue",
        value: renderReadme(data.meta.app),
        language: "markdown",
        uri: `README.md`
      },
      ...(data.pages as any).flatMap(page =>
        this.vueBlocGenService.transform(data, page)
      )
    ] as XlayersNgxEditorModel[];
  }
}
