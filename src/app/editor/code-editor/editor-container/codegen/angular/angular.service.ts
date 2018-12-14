import { Injectable } from '@angular/core';
import { CodeGenFacade, XlayersNgxEditorModel } from '../codegen.service';

@Injectable({
  providedIn: 'root'
})
export class AngularCodeGenService implements CodeGenFacade {

  private indentationSymbol = '  '; // 2 spaces ftw

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
    return '' +
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
    `;
  }

  private generateComponent(ast: SketchMSLayer) {

    return '' +
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
`;
  }

  /**
   * @todo make this dynamic
   */
  private generateComponentSpec() {
    return '' +
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
    `;
  }

  private generateComponentStyles(ast: SketchMSLayer) {

    const styles: Array<string> = [
      [
        ':host {',
        `${this.indentationSymbol}display: block;`,
        `${this.indentationSymbol}position: relative;`,
        '}', ''
      ].join('\n')
    ];

    (function computeStyle(ast: SketchMSLayer, styles, indentationSymbol) {
      if (ast.layers && ast.layers.length > 0) {
        ast.layers.forEach(layer => styles.push(computeStyle(layer, styles, indentationSymbol)));
      } else {
        if (ast.css) {
          const rules: string[] = [];
          for (let prop in ast.css) {
            rules.push(`${prop}: ${ast.css[prop]};`);
          }

          return [
            `.${(ast as any).css__className} {`,
            rules.map(rule => indentationSymbol + rule).join('\n'),
            '}'
          ].join('\n');
        }
        else {
          return null;
        }
      }

    })(ast, styles, this.indentationSymbol);

    return styles.join('\n');
  }

  private generateComponentTemplate(ast: SketchMSLayer) {
    let template: Array<string> = [];

    // indentation
    const i = (n: number) => !!n ? this.indentationSymbol.repeat(n) : '';

    const openTag = (tag = 'div', node: SketchMSLayer, depth: number) => {
      template.push(
        i(depth) +
        ([
          `<${tag}`,
          `class="${(node as any).css__className}"`,
          `role="${node._class}"`,
          `aria-label="${node.name}"`
        ].join(' ')) +
        `>`);
    }

    const closeTag = (tag = 'div', node: SketchMSLayer, depth: number) => {
      template.push(`${i(depth)}</${tag}>`);
    }

    const content = (data: string, depth: number) => {
      if (data) {
        template.push(i(depth) + data);
      }
    }


    (function computeTemplate(ast: SketchMSLayer, template, depth = 0) {

      if (ast.layers && Array.isArray(ast.layers)) {

        ast.layers.forEach(layer => {
          if (layer.css) {
            openTag('div', layer, depth);
          }

          content(computeTemplate(layer, template, depth + 1), depth + 1);

          if (layer.css) {
            closeTag('div', layer, depth);
          }

        });

      } else {

        let innerText = '';
        if ((ast as any)._class === 'text') {
          innerText = `<span>${ast.attributedString.string}</span>`;
        }

        return innerText;
      }

    })(ast, template);

    return template.join('\n');
  }
}
