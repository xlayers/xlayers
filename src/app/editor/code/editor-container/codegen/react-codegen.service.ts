import { Injectable } from '@angular/core';
import { WebCodeGenService } from '@xlayers/web-codegen';

@Injectable({
  providedIn: 'root'
})
export class ReactCodeGenService {
  constructor(private readonly webCodeGen: WebCodeGenService) {}

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
        language: 'text/plain',
        kind: 'text'
      },
      ...data.pages.flatMap(page =>
        this.webCodeGen.aggreate(page, data, { mode: 'react' })
      )
    ];
  }

  private renderReadme(name: string) {
    return `\
## How to use the ${name} Vue module

Import and use it with ReactDOM :

\`\`\`javascript
import ReactDOM from "react-dom";
import { MyComponent } from "./my-component";

ReactDOM.aggreate(
  MyComponent,
  document.getElementById(\'root\')
);
\`\`\`

>  For more information about [Reactjs](https://reactjs.org/)`;
  }
}
