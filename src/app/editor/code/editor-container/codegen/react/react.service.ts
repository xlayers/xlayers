import { Injectable } from '@angular/core';
import { CodeGenFacade, XlayersNgxEditorModel } from '../codegen.service';
import { WebBlocGenService } from '@xlayers/web-blocgen';

@Injectable({
  providedIn: 'root'
})
export class ReactCodeGenService {
  constructor(private webBlocGen: WebBlocGenService) {}

  buttons() {
    return {
      stackblitz: true
    };
  }

  generate(data: SketchMSData): Array<XlayersNgxEditorModel> {
    return [
      {
        uri: 'README.md',
        value: this.renderReadme(data.meta.app).join('\n'),
        language: 'text/plain',
        kind: 'text'
      },
      ...(data.pages as any).flatMap(page =>
        this.webBlocGen.render(page, data, { mode: 'react' })
      )
    ];
  }

  private renderReadme(name: string) {
    return [
      `## How to use the ${name} Vue module`,
      '',
      'Import and use it with ReactDOM :',
      '',
      '```javascript',
      'import ReactDOM from "react-dom";',
      'import { MyComponent } from "./my-component";',
      '',
      'ReactDOM.render(',
      '  MyComponent,',
      '  document.getElementById(\'root\')',
      ');',
      '```',
      '',
      '>  For more information about [Reactjs](https://reactjs.org/)'
    ];
  }
}
