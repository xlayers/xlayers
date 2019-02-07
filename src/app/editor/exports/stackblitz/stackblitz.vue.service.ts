import { Injectable } from '@angular/core';
import { XlayersNgxEditorModel } from '../../code-editor/editor-container/codegen/codegen.service';
import { StackBlitzProjectPayload } from './stackblitz.service';

@Injectable({
  providedIn: 'root'
})
export class ExportStackblitzVueService {
  constructor() {}
  prepare(content: XlayersNgxEditorModel[]): StackBlitzProjectPayload {
    const files = {};
    for (let i = 0; i < content.length; i++) {
      for (const prop in content[i]) {
        if (prop === 'uri') {
          files[`src/app/xlayers/` + content[i].uri] = content[i].value;
        }
      }
    }

    // add extra files
    files['index.js'] = `
import Vue from 'vue'
import App from './src/App.vue'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(App),
})
    `;

    files['index.html'] = `
<div id="app"></div>
    `;

    files['src/App.vue'] = `
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
    `;

    files['babel.config.js'] = `
module.exports = {
  presets: [
    '@vue/app'
  ]
}
    `;

    return {
      files,
      template: 'javascript',
      dependencies: {
        ['vue']: '^2.5.21'
      },
      tags: ['vuejs']
    };
  }
}
