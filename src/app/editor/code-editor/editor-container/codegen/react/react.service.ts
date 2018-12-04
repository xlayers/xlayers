import { Injectable } from '@angular/core';
import { CodeGenFacade, XlayersNgxEditorModel } from '../codegen.service';

@Injectable({
  providedIn: 'root'
})
export class ReactCodeGenService implements CodeGenFacade {

  constructor() {}

  generate(ast: SketchMSLayer): Array<XlayersNgxEditorModel> {
    return [{
      uri: 'README.md',
      value: this.generateReadme(),
      language: 'text/plain',
      kind: 'text'
    }, {
      uri: 'XLayersComponent.ts',
      value: this.generateComponent(),
      language: 'typescript',
      kind: 'react'
    }];
  }

  private generateReadme() {
    return ``;
  }

  /**
   * @todo make this dynamic
   */
  private generateComponent() {
    return `
class XLayersComponent extends React.Component {
  render() {
    return <div></div>;
  }
}
    `;
  }

}
