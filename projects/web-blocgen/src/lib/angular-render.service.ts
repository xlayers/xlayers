import { Injectable } from "@angular/core";
import { WebBlocGenOptions } from "./web-blocgen";
import { WebRenderService } from "./web-render.service";
import { FormatService } from "@xlayers/sketch-lib";

@Injectable({
  providedIn: "root"
})
export class AngularRenderService {
  constructor(
    private format: FormatService,
    private webRender: WebRenderService
  ) {}

  render(current: SketchMSLayer, options: WebBlocGenOptions) {
    const fileName = this.format.fileName(current.name);

    return [
      ...this.webRender.render(current, options).map(file => ({
        ...file,
        kind: "angular"
      })),
      {
        kind: "angular",
        value: this.renderComponent(current.name, options),
        language: "typescript",
        uri: `${options.componentDir}/${fileName}.ts`
      },
      {
        kind: "angular",
        value: this.renderSpec(current.name, options),
        language: "typescript",
        uri: `${options.componentDir}/${fileName}.spec.ts`
      }
    ];
  }

  private renderComponent(name: string, options: WebBlocGenOptions) {
    const componentName = this.format.componentName(name);
    const fileName = this.format.fileName(name);
    const tagName = this.format.fileName(name);

    return [
      "import { Component } from '@angular/core';",
      `import ${componentName} from "./${options.componentDir}/${fileName}";`,
      "",
      "@Component({",
      `  selector: '${options.xmlPrefix}${tagName}',`,
      `  templateUrl: './${fileName}.component.html',`,
      `  styleUrls: ['./${fileName}.component.css']`,
      "})",
      `export class ${componentName}Component {}`
    ].join("\n");
  }

  private renderSpec(name: string, options: WebBlocGenOptions) {
    const componentName = this.format.componentName(name);
    const fileName = this.format.fileName(name);

    return [
      "import { async, ComponentFixture, TestBed } from '@angular/core/testing';",
      `import ${componentName} from "./${options.componentDir}/${fileName}";`,
      "",
      `describe('${componentName}Component', () => {`,
      `  let component: ${componentName}Component;`,
      `  let fixture: ComponentFixture<${componentName}Component>;`,
      "",
      "  beforeEach(async(() => {",
      "    TestBed.configureTestingModule({",
      `      declarations: [ ${componentName}Component ]`,
      "    })",
      "    .compileComponents();",
      "  }));",
      "",
      "  beforeEach(() => {",
      `    fixture = TestBed.createComponent(${componentName}Component);`,
      "    component = fixture.componentInstance;",
      "    fixture.detectChanges();",
      "  });",
      "",
      "  it('should create', () => {",
      "    expect(component).toBeTruthy();",
      "  });",
      "});"
    ].join("\n");
  }
}
