import { Injectable } from '@angular/core';
import { SketchMSData } from '@xlayers/sketchtypes';

@Injectable({
  providedIn: 'root',
})
export class Vue3DocGenService {
  aggregate(data: SketchMSData) {
    return [
      {
        uri: 'README.md',
        value: this.renderReadme(data.meta.app),
        language: 'markdown',
        kind: 'text',
      },
    ];
  }

  private renderReadme(name: string) {
    return `\
## How to use the ${name} Vue 3 module

1. Download and extract the exported module into your workspace,

2. Import the component into your App component or other container.
\`\`\`
<template>
  <div id="app">
    <MyComponent />
  </div>
</template>

<script>
import { defineComponent } from \'vue\'
import MyComponent from \'./components/MyComponent.vue\'

export default defineComponent({
  name: \'app\'
  components: {
    MyComponent
  }
})
</script>
\`\`\`

3. Enjoy.`;
  }
}
