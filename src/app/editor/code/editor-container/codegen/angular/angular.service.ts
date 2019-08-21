import { Injectable } from "@angular/core";
import { WebBlocGenService } from "@xlayers/web-blocgen";

@Injectable({
  providedIn: "root"
})
export class AngularCodeGenService {
  constructor(private webBlocGen: WebBlocGenService) {}

  buttons() {
    return {
      stackblitz: true
    };
  }

  generate(data: SketchMSData) {
    return [
      {
        uri: "README.md",
        value: this.renderReadme(data.meta.app),
        language: "markdown",
        kind: "text"
      },
      {
        uri: "xlayers.module.ts",
        value: this.renderModule(),
        language: "typescript",
        kind: "angular"
      },
      {
        uri: "xlayers-routing.module.ts",
        value: this.renderRoutingModule(),
        language: "typescript",
        kind: "angular"
      },
      ...(data.pages as any).flatMap(page =>
        this.webBlocGen.render(page, data, { mode: "angular" })
      )
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

  private renderModule() {
    return `\
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyComponent } from './components/my-component.component';

@NgModule({
  declarations: [
    MyComponent
  ],
  exports: [
    MyComponent
  ],
  imports: [
    CommonModule
  ]
})
export class XlayersModule {}`;
  }
}
