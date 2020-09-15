import { Injectable } from '@angular/core';
import { StackBlitzProjectPayload } from './stackblitz.service';
import { XlayersNgxEditorModel } from '../../editor-container/codegen/codegen.service';

@Injectable({
  providedIn: 'root',
})
export class ExportStackblitzVueService {
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
    files['index.js'] = `\
import Vue from 'vue'
import App from './src/App.vue'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(App),
})`;

    files['index.html'] = `\
<div id="app"></div>`;

    files['src/App.vue'] = `\
<template>
  <my-component />
</template>

<script>
// import MyComponent from './xlayers/my-component.vue'

export default {
  name: 'app',
  components: {
    // MyComponent
  }
}
</script>`;

    files['babel.config.js'] = `\
module.exports = {
  presets: [
    '@vue/app'
  ]
}`;

    return {
      files,
      template: 'javascript',
      dependencies: {
        ['vue']: '^2.5.21',
      },
      tags: ['vuejs'],
    };
  }
}
