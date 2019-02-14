import { Injectable } from '@angular/core';
import { CodeGenFacade, XlayersNgxEditorModel } from '../codegen.service';
import { SharedCodegen } from '../shared-codegen.service';
import { componentTemplate , readmeTemplate, testE2ETemplate , unitTestTemplate} from './stencil.template';


@Injectable({
  providedIn: 'root'
})
export class StencilCodeGenService implements CodeGenFacade {
  constructor(private sharedCodegen: SharedCodegen) {}

  buttons() {
    return {
      stackblitz: false
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
        uri: 'x-layers-component.tsx',
        value: this.generateComponent(ast),
        language: 'typescript',
        kind: 'stencil'
      },
      {
        uri: 'x-layers-component.spec.ts',
        value: testE2ETemplate(),
        language: 'typescript',
        kind: 'stencil'
      },
      {
        uri: 'x-layers-component.e2e.ts',
        value: unitTestTemplate(),
        language: 'typescript',
        kind: 'stencil'
      },
      {
        uri: 'x-layers-component.css',
        value: this.sharedCodegen.generateComponentStyles(ast),
        language: 'css',
        kind: 'stencil'
      }
    ];
  }

  private generateReadme() {
    return readmeTemplate();
  }

  private generateComponent(ast: SketchMSLayer) {
    return componentTemplate(this.sharedCodegen.generateComponentTemplate(ast, 0));
  }
}
