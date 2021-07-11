import { Injectable } from '@angular/core';
import { SketchMSData } from '@xlayers/sketchtypes';

@Injectable({
  providedIn: 'root',
})
export class SvelteDocgenService {
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
## How to use the ${name} Svelte module

1. Download and extract the exported module into your workspace,

2. Import the svelte component into your main js file:

\`\`\`javascript
import App from "./components/page-1.svelte";


const app = new App({
  target: document.body,
  data: {}
});
\`\`\`

>  For more information about [Svelte](https://svelte.dev/)


    `;
  }
}
