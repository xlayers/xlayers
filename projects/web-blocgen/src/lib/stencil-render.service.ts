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
        value: this.renderComponent(
          current.name,
          html.value,
          context.components,
          options
        ),
        language: 'typescript',
        uri: `${options.componentDir}/${fileName}.tsx`
      },
      {
        kind: 'stencil',
        value: this.renderE2e(current.name),
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
    name: string,
    html: string,
    components: string[],
    options: WebBlocGenOptions
  ) {
    const fileName = this.format.normalizeName(name);
    const componentName = this.format.componentName(name);
    const tagName = this.format.normalizeName(name);
    const importStatements = [
      'import { Component } from \'@stencil/core\';',
      ...components.map(component => {
        const className = this.format.componentName(component);
        const importFileName = this.format.normalizeName(component);
        return `import { ${className} } from "./${importFileName}";`;
      })
    ];

    return `\
${importStatements}

@Component({
  selector: '${options.xmlPrefix}${tagName}',
  styleUrl: './${fileName}.css'
  shadow: true
})',
export class ${componentName}Component {
  render() {
    return (
${this.format.indentFile(3, html).join('\n')}
    );
  }
}`;
  }

  private renderE2e(name: string) {
    const componentName = this.format.componentName(name);
    const tagName = this.format.normalizeName(name);

    return `\
describe('${componentName}', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<${tagName}></${tagName}>');
    const element = await page.find('${tagName}');
    expect(element).toHaveClass('hydrated');
  });
});`;
  }
}
