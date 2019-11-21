import { Injectable } from '@angular/core';
import { FormatService } from '@xlayers/sketch-lib';
import { WebCodeGenService } from '@xlayers/web-codegen';

type WebCodeGenOptions = any;

@Injectable({
  providedIn: 'root'
})
export class StencilAggregatorService {
  constructor(
    private readonly formatService: FormatService,
    private readonly webCodeGenService: WebCodeGenService
  ) {}

  aggregate(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebCodeGenOptions
  ) {
    const fileName = this.formatService.normalizeName(current.name);
    const files = this.webCodeGenService.aggregate(current, data, options);
    const context = this.webCodeGenService.context(current);
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
    options: WebCodeGenOptions
  ) {
    const normalizedName = this.formatService.normalizeName(current.name);
    const className = this.formatService.className(current.name);
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
${this.formatService.indentFile(3, html).join('\n')}
    );
  }
};`;
  }

  private renderE2e(current: SketchMSLayer) {
    const className = this.formatService.className(current.name);
    const tagName = this.formatService.normalizeName(current.name);
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
    const context = this.webCodeGenService.context(current);
    return context && context.components
      ? context.components.map(component => {
          const importclassName = this.formatService.className(component);
          const importFileName = this.formatService.normalizeName(component);
          return `import { ${importclassName} } from "./${importFileName}"; `;
        })
      : [];
  }
}
