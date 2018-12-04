import { Injectable } from '@angular/core';
import { CodeGenFacade, XlayersNgxEditorModel } from '../codegen.service';

@Injectable({
  providedIn: 'root'
})
export class AngularCodeGenService implements CodeGenFacade {

  constructor() { }

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
      value: this.generateComponentTemplate(ast),
      language: 'html',
      kind: 'angular'
    }, {
      uri: 'xlayers.component.css',
      value: this.generateComponentStyles(ast),
      language: 'css',
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

  /**
   * @todo make this dynamic
   */
  private generateModule() {
    return ''+
`
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XLayersComponent } from './xlayers.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [XLayersComponent]
})
export class XLayersModule { }
    `;
  }

  /**
   * @todo make this dynamic
   */
  private generateComponent(ast: SketchMSLayer) {
    console.log(ast);

    return ''+
`import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'xly-component',
  templateUrl: 'xlayers.component.html',
  styleUrls: ['xlayers.component.css']
})
export class XLayersComponent implements OnInit {

  constructor() {}

  ngOnInit() {}
}
`;
  }

  /**
   * @todo make this dynamic
   */
  private generateComponentSpec() {
    return ''+
`
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { XLayersComponent } from './xlayers.component';

describe('XLayersComponent', () => {
  let component: XLayersComponent;
  let fixture: ComponentFixture<XLayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XLayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XLayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
    `;
  }

  /**
   * @todo make this dynamic
   */
  private generateComponentStyles(ast: SketchMSLayer) {

    let styles: Array<string> = [];

    // iife
    (function computeStyle(ast: SketchMSLayer, styles) {
      if (ast.layers && ast.layers.length > 0) {
        ast.layers.forEach(layer => styles.push(computeStyle(layer, styles)));
      } else {
        if (ast.css) {
          const rules: string[] = [];
          const indentation = '  '; // 2 spaces FTW!!
          for (let prop in ast.css) {
            rules.push(`${prop}: ${ast.css[prop]};`);
          }

          return [
            `.${ast.do_objectID} {`,
            rules.map(rule => indentation + rule).join('\n'),
            '}'
          ].join('\n');
        }
        else {
          return null;
        }
      }

    })(ast, styles);

    return [
      ':host { display: block; }',
      styles.join('\n')
    ].join('\n');
  }
  /**
   * @todo make this dynamic
   */
  private generateComponentTemplate(ast: SketchMSLayer) {

    let template: Array<string> = [];
    
    (function computeTemplate(ast: SketchMSLayer, template) {
      if (ast.layers && ast.layers.length > 0) {
        ast.layers.forEach(layer => template.push(computeTemplate(layer, template)));
      } else {
        return [
          `<div class="${ ast.do_objectID }">${ ast._class === 'text' ? ast.name : '' }</div>`
        ].join('\n');
      }

    })(ast, template);

    return template.join('\n');
  }
}
