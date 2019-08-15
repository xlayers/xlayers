import { Injectable } from '@angular/core';
import { XamarinFormsCodeGenVisitor } from './codegen/xamarin-forms-codegenvisitor.service';
import { readmeTemplate, mainPageTemplate } from './xamarin-forms.template';

/**
 * @see CodeGenFacade implementation able to generate Xamarin.Forms code
 */
@Injectable({
  providedIn: 'root'
})
export class XamarinFormsCodeGenService {
  constructor(private readonly codegen: XamarinFormsCodeGenVisitor) {}

  buttons() {
    return {
      stackblitz: false
    };
  }

  generate(ast: SketchMSLayer) {
    return [
      {
        uri: 'README.md',
        value: this.generateReadme(),
        language: 'markdown',
        kind: 'text'
      },
      {
        uri: 'MainPage.xaml',
        value: this.generateComponent(ast),
        language: 'xaml',
        kind: 'xamarinForms'
      },
      ...this.codegen.consumeFileList()
    ];
  }

  private generateReadme() {
    return readmeTemplate();
  }

  private generateComponent(ast: SketchMSLayer) {
    return this.codegen.generateTemplate(ast, mainPageTemplate);
  }
}
