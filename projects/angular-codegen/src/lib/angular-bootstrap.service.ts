import { Injectable } from "@angular/core";
import { FormatService } from "@xlayers/sketch-lib";

type WebCodeGenOptions = any;

@Injectable({
  providedIn: "root"
})
export class AngularBootstrapService {
  constructor(private readonly formatService: FormatService) {}

  generate(files) {
    return [
      {
        uri: "xlayers-routing.module.ts",
        value: this.renderRoutingModule(),
        language: "typescript",
        kind: "angular"
      },
      {
        uri: "xlayers.module.ts",
        value: this.renderModule(files),
        language: "typescript",
        kind: "angular"
      }
    ];
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
      "import { NgModule } from '@angular/core';",
      "import { CommonModule } from '@angular/common';"
    ]
      .concat(
        files
          .filter(file => file.uri.endsWith(".component.ts"))
          .map(
            file =>
              `import { ${this.extractClassName(
                file
              )} } from './${this.extractCompenentFileName(file)}';`
          )
      )
      .join("\n");
  }

  private renderNgClasses(files) {
    return files
      .filter(file => file.uri.endsWith(".component.ts"))
      .map(file => this.formatService.indent(2, this.extractClassName(file)))
      .join(",\n");
  }

  private extractClassName(file) {
    const uri = file.uri.split("/");
    const fileName = uri[uri.length - 1].replace(".component.ts", "");
    return this.formatService.className(`${fileName}Component`);
  }

  private extractCompenentFileName(file) {
    return file.uri.split(".ts")[0];
  }
}
