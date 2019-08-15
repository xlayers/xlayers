import { Injectable } from '@angular/core';
import { WebBlocGenService } from '@xlayers/web-blocgen';

@Injectable({
  providedIn: 'root'
})
export class StencilCodeGenService {
  constructor(private webBlocGen: WebBlocGenService) {}

  buttons() {
    return {
      stackblitz: false
    };
  }

  generate(data: SketchMSData) {
    return [
      {
        uri: 'README.md',
        value: this.renderReadme(),
        language: 'markdown',
        kind: 'text'
      },
      ...(data.pages as any).flatMap(page =>
        this.webBlocGen.render(page, data, { mode: 'stencil' })
      )
    ];
  }

  private renderReadme() {
    return `\
## How to use the Xlayers StencilJS Web Components

This implementation export all assets needed to build stenciljs component

Simple use :
\`\`\`html
  // index.html
  <script src="./my-component.js"></script>
  <my-component></my-component>
\`\`\`

For more examples how to integrate into your application, view [Framework Integrations](https://stenciljs.com/docs/overview)

>  For more information about [Stenciljs](https://stenciljs.com/)'`;
  }
}
