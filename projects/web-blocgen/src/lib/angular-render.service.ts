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
    const name = this.format.snakeName(current.name);

    return [
      ...this.webRender.render(current, options).map(file => ({
        ...file,
        kind: "angular"
      })),
      {
        kind: "angular",
        value: this.renderComponent(name, options),
        language: "typescript",
        uri: `${options.componentDir}/${name}.ts`
      },
      {
        kind: "angular",
        value: this.renderSpec(name, options),
        language: "typescript",
        uri: `${options.componentDir}/${name}.spec.ts`
      }
    ];
  }

  private renderComponent(name: string, options: WebBlocGenOptions) {
    const capitalizedName = this.format.capitalizeName(name);

    const importStatements = [
      "import { Component } from '@angular/core';",
      this.renderImport(name, options)
    ];

    const component = [
      "@Component({",
      `  selector: '${options.xmlPrefix}${name}',`,
      `  templateUrl: './${name}.component.html',`,
      `  styleUrls: ['./${name}.component.css']`,
      "})",
      `export class ${capitalizedName}Component {}`
    ];

    return [...importStatements, "", ...component].join("\n");
  }

  private renderSpec(name: string, options: WebBlocGenOptions) {
    const capitalizedName = this.format.capitalizeName(name);
    const importStatements = this.renderImport(name, options);

    return [
      "import { async, ComponentFixture, TestBed } from '@angular/core/testing';",
      importStatements,
      "",
      `describe('${capitalizedName}Component', () => {`,
      `  let component: ${capitalizedName}Component;`,
      `  let fixture: ComponentFixture<${capitalizedName}Component>;`,
      "",
      "  beforeEach(async(() => {",
      "    TestBed.configureTestingModule({",
      `      declarations: [ ${capitalizedName}Component ]`,
      "    })",
      "    .compileComponents();",
      "  }));",
      "",
      "  beforeEach(() => {",
      `    fixture = TestBed.createComponent(${capitalizedName}Component);`,
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

  private renderImport(name, options) {
    return `import ${name} from "${[options.componentDir, name].join("/")}";`;
  }
}
