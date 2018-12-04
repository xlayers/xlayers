import { Injectable } from '@angular/core';
import { CodeGenFacade, XlayersNgxEditorModel } from '../codegen.service';

@Injectable({
  providedIn: 'root'
})
export class VueCodeGenService implements CodeGenFacade {

  constructor() {}

  generate(ast: SketchMSLayer): Array<XlayersNgxEditorModel> {
    return [{
      uri: 'README.md',
      value: this.generateReadme(),
      language: 'text/plain',
      kind: 'text'
    }, {
      uri: 'xlayers.vue',
      value: this.generateComponent(),
      language: 'javascript',
      kind: 'vue'
    }];
  }

  private generateReadme() {
    return ``;
  }

  /**
   * @todo make this dynamic
   */
  private generateComponent() {
    return `
Vue.component('xly-component', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})
    `;
  }
}
