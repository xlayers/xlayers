import { Injectable } from "@angular/core";
import {
  FormatService,
  SymbolService,
  LayerService,
  ImageService,
  TextService
} from "@xlayers/sketch-lib";
import { WebContextService } from "./web-context.service";
import { WebBlocGenOptions } from "./web-blocgen";
import { CssBlocGenService } from "@xlayers/css-blocgen";
import { SvgBlocGenService } from "@xlayers/svg-blocgen";

@Injectable({
  providedIn: "root"
})
export class WebRenderService {
  constructor(
    private text: TextService,
    private symbol: SymbolService,
    private image: ImageService,
    private format: FormatService,
    private layer: LayerService,
    private webContext: WebContextService,
    private cssBlocGen: CssBlocGenService,
    private svgBlocGen: SvgBlocGenService
  ) {}

  render(current: SketchMSLayer, options: WebBlocGenOptions) {
    const fileName = this.format.normalizeName(current.name);
    return [
      {
        kind: "web",
        value: this.renderComponent(current, options),
        language: "html",
        uri: `${options.componentDir}/${fileName}.html`
      },
      ...this.cssBlocGen.render(current, options).map(file => ({
        ...file,
        kind: "web"
      }))
    ];
  }

  private renderComponent(current: SketchMSLayer, options: WebBlocGenOptions) {
    const template = [];

    if (current._class === "page") {
      this.walk(current, template, 0, options);
    } else {
      this.visit(current, template, 0, options);
    }

    return template.join("\n");
  }

  private walk(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebBlocGenOptions
  ) {
    if (this.layer.identify(current)) {
      current.layers.forEach(layer => {
        this.visit(layer, template, indent, options);
      });
    }
  }

  private visit(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebBlocGenOptions
  ) {
    if (this.symbol.identify(current)) {
      this.visitSymbol(current, template, indent, options);
    } else if (this.image.identify(current)) {
      this.visitBitmap(current, template, indent, options);
    } else if (this.text.identify(current)) {
      this.visitText(current, template, indent, options);
    } else if (this.svgBlocGen.identify(current)) {
      this.visitShape(current, template, indent);
    } else if (this.webContext.identify(current)) {
      this.visitLayer(current, template, indent, options);
    }
  }

  private visitLayer(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebBlocGenOptions
  ) {
    const attributes = this.webContext.of(current).attributes;
    const openTag = [`<${options.blockTagName}`, ...attributes].join(" ") + ">";
    const closeTag = `</${options.blockTagName}>`;

    template.push(this.format.indent(indent, openTag));
    this.walk(current, template, indent + 1, options);
    template.push(this.format.indent(indent, closeTag));
  }

  private visitSymbol(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebBlocGenOptions
  ) {
    const tagName = options.jsx
      ? this.format.componentName(current.name)
      : `${options.xmlPrefix}${this.format.normalizeName(current.name)}`;
    template.push(this.format.indent(indent, `<${tagName}></${tagName}>`));
  }

  private visitBitmap(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebBlocGenOptions
  ) {
    const attributes = this.webContext.of(current).attributes;
    template.push(
      this.format.indent(
        indent,
        [`<${options.bitmapTagName}`, ...attributes].join(" ") + " />"
      )
    );
  }

  private visitText(
    current: SketchMSLayer,
    template: string[],
    indent: number,
    options: WebBlocGenOptions
  ) {
    const text = this.text.lookup(current);
    const attributes = this.webContext.of(current).attributes;
    const openTag = [`<${options.textTagName}`, ...attributes].join(" ") + ">";
    template.push(
      this.format.indent(indent, `${openTag}${text}</${options.textTagName}>`)
    );
  }

  private visitShape(
    current: SketchMSLayer,
    template: string[],
    indent: number
  ) {
    template.push(
      this.svgBlocGen
        .render(current, { xmlNamespace: false })
        .map(file =>
          file.value
            .split("\n")
            .map(line => this.format.indent(indent, line))
            .join("\n")
        )
        .join("\n")
    );
  }
}
