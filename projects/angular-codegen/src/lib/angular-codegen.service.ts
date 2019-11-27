import { Injectable } from '@angular/core';
import {
  ImageService,
  SymbolService,
  LayerService,
  FormatService
} from '@xlayers/sketch-lib';
import { WebCodeGenService } from '@xlayers/web-codegen';
import { AngularAggregatorService } from './angular-aggregator.service';

type WebCodeGenOptions = any;

@Injectable({
  providedIn: 'root'
})
export class AngularCodeGenService {
  constructor(
    private readonly symbolService: SymbolService,
    private readonly imageService: ImageService,
    private readonly webCodeGen: WebCodeGenService,
    private readonly formatService: FormatService,
    private readonly angularAggretatorService: AngularAggregatorService,
    private readonly layerService: LayerService
  ) {}

  compute(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebCodeGenOptions
  ) {
    this.webCodeGen.compute(current, data, this.compileOptions(options));
  }

  aggregate(data: SketchMSData, options?: WebCodeGenOptions) {
    const files = data.pages.flatMap(page =>
      this.visit(page, data, this.compileOptions(options))
    );

    return [
      {
        uri: 'xlayers-routing.module.ts',
        value: this.renderRoutingModule(),
        language: 'typescript',
        kind: 'angular'
      },
      {
        uri: 'xlayers.module.ts',
        value: this.renderModule(files),
        language: 'typescript',
        kind: 'angular'
      },
      ...files
    ];
  }

  identify(current: SketchMSLayer) {
    return this.webCodeGen.identify(current);
  }

  context(current: SketchMSLayer) {
    return this.webCodeGen.context(current);
  }

  private visit(
    current: SketchMSLayer,
    data: SketchMSData,
    options?: WebCodeGenOptions
  ) {
    return this.visitContent(current, data, options).concat(
      this.angularAggretatorService.aggregate(current, data, options)
    );
  }

  private visitContent(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebCodeGenOptions
  ) {
    if (this.layerService.identify(current)) {
      return this.visitLayer(current, data, options);
    } else if (this.symbolService.identify(current)) {
      return this.visitSymbolMaster(current, data, options);
    } else if (this.imageService.identify(current)) {
      return this.imageService.aggregate(current, data, options);
    }
    return [];
  }

  private visitLayer(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebCodeGenOptions
  ) {
    return this.layerService
      .lookup(current)
      .flatMap(layer => this.visitContent(layer, data, options));
  }

  private visitSymbolMaster(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebCodeGenOptions
  ) {
    const symbolMaster = this.symbolService.lookup(current, data);
    if (symbolMaster) {
      return this.visit(symbolMaster, data, options);
    }
    return [];
  }

  private compileOptions(options: WebCodeGenOptions) {
    return {
      textTagName: 'span',
      bitmapTagName: 'img',
      blockTagName: 'div',
      xmlPrefix: 'xly-',
      cssPrefix: 'xly_',
      componentDir: 'components',
      assetDir: 'assets',
      ...options
    };
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

  private renderModule(files) {
    const importStatements = this.renderImports(files);
    const ngStatements = this.renderNgClasses(files);
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

  private renderImports(files) {
    return [
      'import { NgModule } from \'@angular/core\';',
      'import { CommonModule } from \'@angular/common\';'
    ]
      .concat(
        files
          .filter(file => file.uri.endsWith('.component.ts'))
          .map(
            file =>
              `import { ${this.extractClassName(
                file
              )} } from './${this.extractCompenentFileName(file)}';`
          )
      )
      .join('\n');
  }

  private renderNgClasses(files) {
    return files
      .filter(file => file.uri.endsWith('.component.ts'))
      .map(file => this.formatService.indent(2, this.extractClassName(file)))
      .join(',\n');
  }

  private extractClassName(file) {
    const uri = file.uri.split('/');
    const fileName = uri[uri.length - 1].replace('.component.ts', '');
    return this.formatService.className(`${fileName}Component`);
  }

  private extractCompenentFileName(file) {
    return file.uri.split('.ts')[0];
  }
}
