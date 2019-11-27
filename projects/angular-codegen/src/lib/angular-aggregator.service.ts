import { Injectable } from '@angular/core';
import { WebCodeGenService } from '@xlayers/web-codegen';
import { FormatService } from '@xlayers/sketch-lib';

type WebCodeGenOptions = any;

@Injectable({
  providedIn: 'root'
})
export class AngularAggregatorService {
  constructor(
    private readonly formatService: FormatService,
    private readonly webCodeGenService: WebCodeGenService
  ) {}

  aggregate(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebCodeGenOptions
  ) {
    const fileName = this.formatService.normalizeName(current.name);
    return [
      ...this.webCodeGenService.aggregate(current, data, options).map(file => {
        switch (file.language) {
          case 'html':
            return {
              ...file,
              kind: 'angular',
              uri: `${options.componentDir}/${fileName}.component.html`
            };

          case 'css':
            return {
              ...file,
              kind: 'angular',
              uri: `${options.componentDir}/${fileName}.component.css`
            };

          default:
            return {
              ...file,
              kind: 'angular'
            };
        }
      }),
      {
        kind: 'angular',
        value: this.renderComponent(current.name, options),
        language: 'typescript',
        uri: `${options.componentDir}/${fileName}.component.ts`
      },
      {
        kind: 'angular',
        value: this.renderSpec(current.name),
        language: 'typescript',
        uri: `${options.componentDir}/${fileName}.spec.ts`
      }
    ];
  }

  renderComponent(name: string, options: WebCodeGenOptions) {
    const className = this.formatService.className(name);
    const normalizedName = this.formatService.normalizeName(name);
    const tagName = `${options.xmlPrefix}${normalizedName}`;
    return `\
import { Component } from '@angular/core';

@Component({
  selector: '${tagName}',
  templateUrl: './${normalizedName}.component.html',
  styleUrls: ['./${normalizedName}.component.css']
})
export class ${className}Component {}`;
  }

  private renderSpec(name: string) {
    const className = this.formatService.className(name);
    const fileName = this.formatService.normalizeName(name);
    return `\
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ${className} } from "./${fileName}";

describe('${className}Component', () => {
  let component: ${className}Component;
  let fixture: ComponentFixture<${className}Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [${className}Component]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(${className}Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});`;
  }
}
