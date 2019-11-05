import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReactDocGenService {
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
## How to use the ${name} Vue module

Import and use it with ReactDOM :

\`\`\`javascript
import ReactDOM from "react-dom";
import { MyComponent } from "./my-component";

ReactDOM.aggregate(
  MyComponent,
  document.getElementById(\'root\')
);
\`\`\`

>  For more information about [Reactjs](https://reactjs.org/)`;
  }
}
