import { Injectable } from '@angular/core';
import { CodeGenFacade, XlayersNgxEditorModel } from '../codegen.service';
import { SharedCodegen } from '../shared-codegen.service';

@Injectable({
  providedIn: 'root'
})
export class VueCodeGenService implements CodeGenFacade {

  constructor(private sharedCodegen: SharedCodegen) {}

  generate(ast: SketchMSLayer): Array<XlayersNgxEditorModel> {
    return [{
      uri: 'README.md',
      value: this.generateReadme(),
      language: 'text/plain',
      kind: 'text'
    }, {
      uri: 'Xlayers.vue',
      value: this.generateComponent(ast),
      language: 'javascript',
      kind: 'vue'
    }];
  }

  private generateReadme() {
    const codeBlock = '```';
    return (
      '' +
      `
## How to use the Xlayers Vuejs module

1. Download and extract the exported module into your workspace,

2. Import the component into your App component or other container.
${codeBlock}
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
${codeBlock}

3. Enjoy.
      `
    );
  }

  /**
   * @todo make this dynamic
   */
  private generateComponent(ast: SketchMSLayer) {
    return (
      '' +
      `
<template>
  ${this.sharedCodegen.generateComponentTemplate(ast, 1)}
</template>

<script>
export default {}
</script>

<style>
${this.sharedCodegen.generateComponentTemplate(ast, 1)}
</style>
      `
    );
  }
}
