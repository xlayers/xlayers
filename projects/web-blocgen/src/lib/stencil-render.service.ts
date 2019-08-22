import { Injectable } from '@angular/core';
import { FormatService } from '@xlayers/sketch-lib';
import { WebRenderService } from './web-render.service';
import { WebBlocGenOptions } from './web-blocgen';
import { WebContextService } from './web-context.service';

@Injectable({
  providedIn: 'root'
})
export class StencilRenderService {
  constructor(
    private format: FormatService,
    private webContext: WebContextService,
    private webRender: WebRenderService
  ) {}

  render(current: SketchMSLayer, options: WebBlocGenOptions) {
    const fileName = this.format.normalizeName(current.name);
    const files = this.webRender.render(current, options);
    const context = this.webContext.of(current);
    const html = files.find(file => file.language === 'html');
    return [
      {
        kind: 'stencil',
        value: this.renderComponent(current, html.value, options),
        language: 'typescript',
        uri: `${options.componentDir}/${fileName}.tsx`
      },
      {
        kind: 'stencil',
        value: this.renderE2e(current),
        language: 'typescript',
        uri: `${options.componentDir}/${fileName}.e2e.ts`
      },
      ...files
        .filter(file => file.language !== 'html')
        .map(file => ({
          ...file,
          kind: 'stencil'
        }))
    ];
  }

  private renderComponent(
    current: SketchMSLayer,
    html: string,
    options: WebBlocGenOptions
  ) {
    const normalizedName = this.format.normalizeName(current.name);
    const className = this.format.className(current.name);
    const tagName = `${options.xmlPrefix}${normalizedName}`;
    const importStatements = this.renderImportStatements(current);
    return `\
${importStatements}

@Component({
  selector: '${tagName}',
  styleUrl: './${normalizedName}.css'
  shadow: true
})
export class ${className}Component {
  render() {
    return (
${this.format.indentFile(3, html).join('\n')}
    );
  }
};`;
  }

  private renderE2e(current: SketchMSLayer) {
    const className = this.format.className(current.name);
    const tagName = this.format.normalizeName(current.name);
    return `\
describe('${className}', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<${tagName}></${tagName}>');
    const element = await page.find('${tagName}');
    expect(element).toHaveClass('hydrated');
  });
});`;
  }

  private renderImportStatements(current: SketchMSLayer) {
    return [
      'import { Component } from \'@stencil/core\';',
      ...this.generateDynamicImport(current)
    ].join('\n');
  }

  private generateDynamicImport(current: SketchMSLayer) {
    const context = this.webContext.of(current);
    return context && context.components
      ? context.components.map(component => {
          const importclassName = this.format.className(component);
          const importFileName = this.format.normalizeName(component);
          return `import { ${importclassName} } from "./${importFileName}"; `;
        })
      : [];
  }
}
