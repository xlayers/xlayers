import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebComponentDocGenService {
  aggregate(data: SketchMSData) {
    return [
      {
        uri: 'README.md',
        value: this.renderReadme(data.meta.app),
        language: 'markdown',
        kind: 'text'
      }
    ];
  }

  private renderReadme(name: string) {
    return `\
## How to use the ${name} Web Components

This implementation export the assets as single file web component that can be consumed in the following ways:

\`\`\`html
  // index.html
  <script src="./my-component.js"></script>
  <my-component></my-component>
\`\`\`

> Needed polyfills are imported inside the my-component, in most cases you can import it globally or use different strategy. For example:

\`\`\`html
  //index.html
  <!-- Load polyfills; note that "loader" will load these async -->
  <script src="node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js" defer></script>

  <!-- Load a custom element definitions in \'waitFor\' and return a promise -->
  <script type="module">
    WebComponents.waitFor(() => {
    // You should remove redundant polyfills import from my-component
    return import(\'./my-component.js\');
    });
  </script>

  <!-- Use the custom element -->
  <my-component></my-component>
\`\`\`

>  For more information about [web components and browser support](https://github.com/WebComponents/webcomponentsjs#browser-support)`;
  }
}
