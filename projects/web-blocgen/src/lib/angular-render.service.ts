import { Injectable } from '@angular/core';
import { WebBlocGenOptions } from './web-blocgen';
import { WebRenderService } from './web-render.service';
import { FormatService } from '@xlayers/sketch-lib';

@Injectable({
  providedIn: 'root'
})
export class AngularRenderService {
  constructor(
    private format: FormatService,
    private webRender: WebRenderService
  ) {}

  render(current: SketchMSLayer, options: WebBlocGenOptions) {
    const fileName = this.format.normalizeName(current.name);
    return [
      ...this.webRender.render(current, options).map(file => {
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
        value: this.renderSpec(current.name, options),
        language: 'typescript',
        uri: `${options.componentDir}/${fileName}.spec.ts`
      }
    ];
  }

  private renderComponent(name: string, options: WebBlocGenOptions) {
    const className = this.format.className(name);
    const normalizedName = this.format.normalizeName(name);
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

  private renderSpec(name: string, options: WebBlocGenOptions) {
    const className = this.format.className(name);
    const fileName = this.format.normalizeName(name);
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
