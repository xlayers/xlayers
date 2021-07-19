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
    files['index.ts'] = `\
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
`;

    files['index.html'] = `\
<div id="app"></div>`;

    files['src/App.vue'] = `\
<template>
  <my-component />
</template>

<script>
// import MyComponent from './xlayers/my-component.vue'

export default defineComponent({
  name: 'app',
  components: {
    // MyComponent
  }
})
</script>`;

    files['babel.config.js'] = `\
module.exports = {
  presets: [
    '@vue/app'
  ]
}`;

    files['tsconfig.json'] = `\
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "strict": true,
    "jsx": "preserve",
    "importHelpers": true,
    "moduleResolution": "node",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "baseUrl": ".",
    "types": [
      "webpack-env"
    ],
    "paths": {
      "@/*": [
        "src/*"
      ]
    },
    "lib": [
      "esnext",
      "dom",
      "dom.iterable",
      "scripthost"
    ]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "tests/**/*.ts",
    "tests/**/*.tsx"
  ],
  "exclude": [
    "node_modules"
  ]
}
`;

    files['tsconfig.json'] = `\
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
`;

    return {
      files,
      template: 'javascript',
      dependencies: {
        ['vue']: '^3.0.0',
      },
      tags: ['vuejs'],
    };
  }
}
