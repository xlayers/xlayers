import { Injectable } from "@angular/core";
import { XlayersNgxEditorModel } from "../codegen.service";

const renderReadme = () => `\
## How to use the Xlayers Angular module

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

3. Enjoy.
`;

const renderModule = () => `\
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XlayersComponent } from './xlayers.component';

@NgModule({
  declarations: [
    XlayersComponent
  ],
  exports: [
    XlayersComponent
  ],
  imports: [
    CommonModule
  ]
})
export class XlayersModule { }
`;

const renderRoutingModule = () => `\
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const xlayersRoutes: Routes = [{
  path: 'xlayers',
  loadChildren: 'app/xlayers/xlayers.module#XlayersModule'
}];

@NgModule({
  imports: [ RouterModule.forChild(xlayersRoutes) ],
  exports: [ RouterModule ]
})
export class XlayersRoutingModule {}
`;

@Injectable({
  providedIn: "root"
})
export class AngularCodeGenService {
  buttons() {
    return {
      stackblitz: true
    };
  }

  generate(data: SketchMSData): Array<XlayersNgxEditorModel> {
    return [
      {
        uri: "README.md",
        value: renderReadme(),
        language: "markdown",
        kind: "text"
      },
      {
        uri: "xlayers.module.ts",
        value: renderModule(),
        language: "typescript",
        kind: "angular"
      },
      {
        uri: "xlayers-routing.module.ts",
        value: renderRoutingModule(),
        language: "typescript",
        kind: "angular"
      }
    ];
  }
}
