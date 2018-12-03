import { Injectable } from '@angular/core';
import { CodeGenFacade, XlayersNgxEditorModel } from '../codegen.service';

@Injectable({
  providedIn: 'root'
})
export class ReactCodeGenService implements CodeGenFacade {

  constructor() {}

  generate(): Array<XlayersNgxEditorModel> {
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

  private info() {
    return `File auto-generated by xlayers.app on ${new Date()}`;
  }

  private generateReadme() {
    return `${ this.info() }`;
  }

  /**
   * @todo make this dynamic
   */
  private generateComponent() {
    return `// ${ this.info() }
class XLayersComponent extends React.Component {
  render() {
    return <div></div>;
  }
}
    `;
  }

}
