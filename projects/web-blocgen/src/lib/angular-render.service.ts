import { Injectable } from "@angular/core";
import { WebContextService } from "./web-context.service";
import { WebOptimizerService } from "./web-optimizer.service";
import { ResourceService, FormatService } from "@xlayers/sketch-lib";
import { WebBlocGenContext, WebBlocGenOptions } from "./web-blocgen.d";

@Injectable({
  providedIn: "root"
})
export class AngularRenderService {
  constructor(
    private format: FormatService,
    private resource: ResourceService,
    private webContext: WebContextService,
    private webOptimizer: WebOptimizerService
  ) {}

  render(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    const name = this.format.normalizeName(current.name);
    const context = this.webContext.contextOf(current);

    return [
      ...this.traverse(data, current, options).map(file => ({
        ...file,
        kind: "angular"
      })),
      {
        kind: "angular",
        value: context.html.join("\n"),
        language: "html",
        uri: `${options.componentDir}/${name}.html`
      },
      {
        kind: "angular",
        value: context.css.join("\n\n"),
        language: "css",
        uri: `${options.componentDir}/${name}.css`
      },
      {
        kind: "angular",
        value: this.renderComponent(name, context, options).join("\n"),
        language: "javascript",
        uri: `${options.componentDir}/${name}.spec.js`
      },
      {
        kind: "angular",
        value: this.renderComponentSpec(name, options).join("\n"),
        language: "javascript",
        uri: `${options.componentDir}/${name}.spec.js`
      }
    ];
  }

  private traverse(
    data: SketchMSData,
    current: SketchMSLayer,
    options: WebBlocGenOptions
  ) {
    if (this.webContext.identify(current)) {
      return (current.layers as any).flatMap(layer =>
        this.traverse(data, layer, options)
      );
    }
    return this.retrieveFiles(data, current, options);
  }

  private retrieveFiles(
    data: SketchMSData,
    current: SketchMSLayer,
    options: WebBlocGenOptions
  ) {
    if (this.resource.identifySymbolInstance(current)) {
      return this.retrieveSymbolMaster(data, current, options);
    }
    if (this.resource.identifyBitmap(current)) {
      return this.retrieveBitmap(data, current, options);
    }
    return [];
  }

  private retrieveSymbolMaster(
    data: SketchMSData,
    current: SketchMSLayer,
    options: WebBlocGenOptions
  ) {
    const symbolMaster = this.resource.lookupSymbolMaster(current, data);

    if (symbolMaster) {
      return this.render(symbolMaster, data, options);
    }

    return [];
  }

  private retrieveBitmap(
    data: SketchMSData,
    current: SketchMSLayer,
    options: WebBlocGenOptions
  ) {
    const image = this.lookupImage(current, data);

    return [
      {
        kind: "angular",
        value: image,
        language: "binary",
        uri: `${options.assetDir}/${this.format.normalizeName(
          current.name
        )}.jpg`
      }
    ];
  }

  private renderComponent(
    name: string,
    context: WebBlocGenContext,
    options: WebBlocGenOptions
  ) {
    const capitalizedName = this.capitalizeName(name);

    const importStatementss = [
      "import { Component, OnInit } from '@angular/core';",
      ...context.components.map(component =>
        this.renderImport(component, options)
      )
    ];

    const component = [
      "@Component({",
      `  selector: '${options.xmlPrefix}${name}',`,
      `  templateUrl: './${name}.component.html',`,
      `  styleUrls: ['./${name}.component.css']`,
      "})",
      `export class ${capitalizedName}Component implements OnInit {`,
      "  constructor() { }",
      "  ngOnInit() {",
      "  }",
      "}"
    ];

    return [...importStatementss, "", ...component];
  }

  private renderComponentSpec(name: string, options: WebBlocGenOptions) {
    const capitalizedName = this.capitalizeName(name);
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
    ];
  }

  private renderImport(name, options) {
    return `import ${name} from "${[options.componentDir, name].join("/")}";`;
  }

  private capitalizeName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  private lookupImage(current: SketchMSLayer, data: SketchMSData) {
    const content = this.resource.lookupBitmap(current, data);
    const bin = atob(content);
    const buf = new Uint8Array(bin.length);
    Array.prototype.forEach.call(bin, (ch, i) => {
      buf[i] = ch.charCodeAt(0);
    });
    return buf;
  }
}
