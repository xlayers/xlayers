import { Injectable } from '@angular/core';
import { WebCodeGenService } from '@xlayers/web-codegen';
import { FormatService } from '@xlayers/sketch-lib';

@Injectable({
  providedIn: 'root'
})
export class AngularCodeGenService {
  constructor(
    private formatService: FormatService,
    private webCodeGen: WebCodeGenService
  ) {}

  buttons() {
    return {
      stackblitz: true
    };
  }

  generate(data: SketchMSData) {
    const generatedFiles = data.pages.flatMap(page =>
      this.webCodeGen.aggreate(page, data, { mode: 'angular' })
    );
    return [
      {
        uri: 'README.md',
        value: this.renderReadme(data.meta.app),
        language: 'markdown',
        kind: 'text'
      },
      {
        uri: 'xlayers-routing.module.ts',
        value: this.renderRoutingModule(),
        language: 'typescript',
        kind: 'angular'
      },
      {
        uri: 'xlayers.module.ts',
        value: this.renderModule(generatedFiles),
        language: 'typescript',
        kind: 'angular'
      },
      ...generatedFiles
    ];
  }

  private renderReadme(name: string) {
    return `\
## How to use the ${name} Vue module

1. Download and extract the exported module into your workspace,

2. Option #1: Import eagerly the XlayersModule into your AppModule or other module.
\`\`\`
import { XlayersModule } from './xlayers/xlayers.module';

@NgModule({
  imports: [
    XlayersModule,
    ...
  ],
})
export class AppModule {}
\`\`\`

2. Option #2: Import lazily the XlayersModule routing configuration into your AppModule or other module.
Make sure your router is setup properly in order to use this option (see: https://angular.io/guide/lazy-loading-ngmodules).

\`\`\`
import { XlayersRoutingModule } from './xlayers/xlayers-routing.module';
@NgModule({
  imports: [
    XlayersRoutingModule,
    ...
  ],
})
export class AppModule {}
\`\`\`

3. Enjoy.`;
  }

  private renderRoutingModule() {
    return `\
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router';

const xlayersRoutes: Routes = [{
  path: 'xlayers\
  loadChildren: 'app/xlayers/xlayers.module#XlayersModule'
}];

@NgModule({
  imports: [ RouterModule.forChild(xlayersRoutes) ],
  exports: [ RouterModule ]
})
export class XlayersRoutingModule {}`;
  }

  private renderModule(generatedFiles) {
    const importStatements = this.renderImports(generatedFiles);
    const ngStatements = this.renderNgClasses(generatedFiles);
    return `\
${importStatements}

@NgModule({
  declarations: [
${ngStatements}
  ],
  exports: [
${ngStatements}
  ],
  imports: [
    CommonModule
  ]
})
export class XlayersModule {}`;
  }

  private renderImports(generatedFiles) {
    return [
      'import { NgModule } from \'@angular/core\';',
      'import { CommonModule } from \'@angular/common\';'
    ]
      .concat(
        generatedFiles
          .filter(file => file.uri.endsWith('.component.ts'))
          .map(
            file =>
              `import { ${this.extractClassName(file)} } from './${file.uri}';`
          )
      )
      .join('\n');
  }

  private renderNgClasses(generatedFiles) {
    return generatedFiles
      .filter(file => file.uri.endsWith('.component.ts'))
      .map(file => this.formatService.indent(2, this.extractClassName(file)))
      .join(',\n');
  }

  private extractClassName(file) {
    const uri = file.uri.split('/');
    const fileName = uri[uri.length - 1].replace('.component.ts', '');
    return this.formatService.className(`${fileName}Component`);
  }
}
