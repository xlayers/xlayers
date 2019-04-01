import { Injectable } from '@angular/core';
import { CodeGenFacade, XlayersNgxEditorModel } from '../codegen.service';
import { SharedCodegen, Template } from '../shared-codegen.service';
import { wcTemplate, readmeTemplate } from './wc.template';

@Injectable({
  providedIn: 'root'
})
export class WCCodeGenService implements CodeGenFacade {

  constructor(private sharedCodegen: SharedCodegen) {}

  buttons() {
    return {
      stackblitz: true
    };
  }

  generate(ast: SketchMSLayer): Array<XlayersNgxEditorModel> {
    return [
      {
        uri: 'README.md',
        value: this.generateReadme(),
        language: 'markdown',
        kind: 'text'
      },
      {
        uri: 'index.js',
        value: this.generateComponent(ast),
        language: 'javascript',
        kind: 'wc'
      }
    ];
  }

  private generateReadme() {
    return readmeTemplate();
  }

  private generateComponent(ast: SketchMSLayer) {
    return wcTemplate(
      this.sharedCodegen.generateComponentTemplate(ast, Template.HTML),
      this.sharedCodegen.generateComponentStyles(ast)
    );
  }
}
