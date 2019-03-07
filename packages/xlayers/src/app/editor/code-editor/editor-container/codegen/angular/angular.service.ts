import { Injectable } from '@angular/core';
import { CodeGenFacade, XlayersNgxEditorModel } from '../codegen.service';
import { SharedCodegen, Template } from '../shared-codegen.service';

@Injectable({
  providedIn: 'root'
})
export class AngularCodeGenService implements CodeGenFacade {

  constructor(private sharedCodegen: SharedCodegen) { }

  buttons() {
    return {
      stackblitz: true
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
        uri: 'xlayers.component.ts',
        value: this.generateComponent(ast),
        language: 'typescript',
        kind: 'angular'
      },
      {
        uri: 'xlayers.component.html',
        value: this.sharedCodegen.generateComponentTemplate(ast, Template.HTML),
        language: 'html',
        kind: 'angular'
      },
      {
        uri: 'xlayers.component.css',
        value: this.sharedCodegen.generateComponentStyles(ast),
        language: 'css',
        kind: 'angular'
      },
      {
        uri: 'xlayers.component.spec.ts',
        value: this.generateComponentSpec(),
        language: 'typescript',
        kind: 'angular'
      },
      {
        uri: 'xlayers.module.ts',
        value: this.generateModule(),
        language: 'typescript',
        kind: 'angular'
      },
      {
        uri: 'xlayers-routing.module.ts',
        value: this.generateRoutingModule(),
        language: 'typescript',
        kind: 'angular'
      }
    ];
  }

  private generateReadme() {
    const codeBlock = '```';
    return `
## How to use the Xlayers Angular module

1. Download and extract the exported module into your workspace,

2. Option #1: Import eagerly the XlayersModule into your AppModule or other module.
${codeBlock}
import { XlayersModule } from './xlayers/xlayers.module';
@NgModule({
  imports: [
    XlayersModule,
    ...
  ],
})
export class AppModule {}
${codeBlock}

2. Option #2: Import lazily the XlayersModule routing configuration into your AppModule or other module.
Make sure your router is setup properly in order to use this option (see: https://angular.io/guide/lazy-loading-ngmodules).
${codeBlock}
import { XlayersRoutingModule } from './xlayers/xlayers-routing.module';
@NgModule({
  imports: [
    XlayersRoutingModule,
    ...
  ],
})
export class AppModule {}
${codeBlock}

3. Enjoy.
`;
  }

  private generateModule() {
    return (
      '' +
      `
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
    `
    );
  }

  private generateRoutingModule() {
    return (
      '' +
      `
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
    `
    );
  }

  private generateComponent(ast: SketchMSLayer) {
    return (
      '' +
      `
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-xlayers',
  templateUrl: './xlayers.component.html',
  styleUrls: ['./xlayers.component.css']
})
export class XlayersComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
`
    );
  }

  /**
   * @todo make this dynamic
   */
  private generateComponentSpec() {
    return (
      '' +
      `
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { XlayersComponent } from './xlayers.component';

describe('XlayersComponent', () => {
  let component: XlayersComponent;
  let fixture: ComponentFixture<XlayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XlayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
    `
    );
  }
}
