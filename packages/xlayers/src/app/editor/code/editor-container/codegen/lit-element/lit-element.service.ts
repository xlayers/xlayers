import { Injectable } from '@angular/core';
import { CodeGenFacade, XlayersNgxEditorModel } from '../codegen.service';
import { SharedCodegen, Template } from '../shared-codegen.service';
import { litElementTemplate, readmeTemplate } from './lit-element.template';

@Injectable({
  providedIn: 'root'
})
export class LitElementCodeGenService implements CodeGenFacade {

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
        uri: 'x-layers-element.js',
        value: this.generateComponent(ast),
        language: 'javascript',
        kind: 'litElement'
      }
    ];
  }

  private generateReadme() {
    return readmeTemplate();
  }

  private generateComponent(ast: SketchMSLayer) {
    return litElementTemplate(
      this.sharedCodegen.generateComponentTemplate(ast, Template.HTML),
      this.sharedCodegen.generateComponentStyles(ast)
    );
  }
}
