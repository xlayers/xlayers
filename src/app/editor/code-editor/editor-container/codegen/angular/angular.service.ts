import { Injectable } from '@angular/core';
import { CodeGenFacade, XlayersNgxEditorModel } from '../codegen.service';
import { SharedCodegen } from '../shared-codegen.service';

@Injectable({
  providedIn: 'root'
})
export class AngularCodeGenService implements CodeGenFacade {
  private indentationSymbol = '  '; // 2 spaces ftw

  constructor(private sharedCodegen: SharedCodegen) { }

  generate(ast: SketchMSLayer): Array<XlayersNgxEditorModel> {
    return [{
      uri: 'README.md',
      value: this.generateReadme(),
      language: 'markdown',
      kind: 'text'
    }, {
      uri: 'xlayers.component.ts',
      value: this.generateComponent(ast),
      language: 'typescript',
      kind: 'angular'
    }, {
      uri: 'xlayers.component.html',
      value: this.sharedCodegen.generateComponentTemplate(ast),
      language: 'html',
      kind: 'angular'
    }, {
      uri: 'xlayers.component.css',
      value: this.sharedCodegen.generateComponentStyles(ast),
      language: 'less',
      kind: 'angular'
    }, {
      uri: 'xlayers.component.spec.ts',
      value: this.generateComponentSpec(),
      language: 'typescript',
      kind: 'angular'
    }, {
      uri: 'xlayers.module.ts',
      value: this.generateModule(),
      language: 'typescript',
      kind: 'angular'
    }];
  }

  private generateReadme() {
    return ``;
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
