import { Injectable } from '@angular/core';
import { SketchMSData } from '@xlayers/sketchtypes';

@Injectable({
  providedIn: 'root',
})
export class StencilDocGenService {
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
## How to use the ${name} StencilJS Web Components

This implementation export all assets needed to build stenciljs component

Simple use :
\`\`\`html
  // index.html
  <script src="./my-component.js"></script>
  <my-component></my-component>
\`\`\`

For more examples how to integrate into your application, view [Framework Integrations](https://stenciljs.com/docs/overview)

>  For more information about [Stenciljs](https://stenciljs.com/)`;
  }
}
