import { Injectable } from "@angular/core";
import { XlayersNgxEditorModel } from "../codegen.service";
import { WebBlocGenService } from "@xlayers/web-blocgen";

@Injectable({
  providedIn: "root"
})
export class VueCodeGenService {
  constructor(private webBlocGen: WebBlocGenService) {}

  buttons() {
    return {};
  }

  generate(data: SketchMSData) {
    return [
      {
        kind: "vue",
        value: this.renderReadme(data.meta.app),
        language: "markdown",
        uri: `README.md`
      },
      ...(data.pages as any).flatMap(page =>
        this.webBlocGen.render(page, data, { mode: "vue" })
      )
    ] as XlayersNgxEditorModel[];
  }

  private renderReadme(name: string) {
    return `\
## How to use the ${name} Vue module

1. Download and extract the exported module into your workspace,

2. Import the component into your App component or other container.
\`\`\`
<template>
  <div id="app">
    <MyComponent />
  </div>
</template>

<script>
import MyComponent from \'./components/MyComponent.vue\'

export default {
  name: \'app\
  components: {
    MyComponent
  }
}
</script>
\`\`\`

3. Enjoy.'`;
  }
}
