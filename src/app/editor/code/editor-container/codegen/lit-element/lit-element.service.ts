import { Injectable } from '@angular/core';
import { WebCodeGenService } from '@xlayers/web-codegen';

@Injectable({
  providedIn: 'root'
})
export class LitElementCodeGenService {
  constructor(private webCodeGen: WebCodeGenService) {}

  buttons() {
    return {
      stackblitz: true
    };
  }

  generate(data: SketchMSData) {
    return [
      {
        uri: 'README.md',
        value: this.renderReadme(data.meta.app),
        language: 'markdown',
        kind: 'text'
      },
      ...data.pages.flatMap(page =>
        this.webCodeGen.aggreate(page, data, { mode: 'litElement' })
      )
    ];
  }

  private renderReadme(name: string) {
    return `\
## How to use the ${name} Web Components built with LitElement

This implementation export the assets as single file web component that can be consumed in the following ways:

\`\`\`html
<!–– index.html ––>
<script src="./x-layers-element.js"></script>
<x-layers-element></x-layers-element>
\`\`\`

> Needed polyfills must be imported, in most cases you can import it globally or use different strategy. For example:

\`\`\`html
<!–– index.html ––>
<!-- Load polyfills; note that "loader" will load these async -->
<script src="node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js" defer></script>

<!-- Load a custom element definitions in \'waitFor\' and return a promise -->
<script type="module">
  WebComponents.waitFor(() => {
    return import(\'./x-layers-element.js\');
  });
</script>

<!-- Use the custom element -->
<x-layers-element></x-layers-element>
\`\`\`

>  [LitElement website](https://lit-element.polymer-project.org/)
>  For more information about [web components and browser support](https://github.com/WebComponents/webcomponentsjs#browser-support)`;
  }
}
