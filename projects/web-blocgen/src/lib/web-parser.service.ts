import { Injectable } from "@angular/core";
import {
  XmlService,
  FormatService,
  ResourceService
} from "@xlayers/sketch-lib";
import { CssBlocGenService } from "@xlayers/css-blocgen";
import { SvgBlocGenService } from "@xlayers/svg-blocgen";
import { AstService } from "@xlayers/sketch-lib";
import { WebContextService } from "./web-context.service";
import { WebBlocGenOptions } from "./web-blocgen.d";
import { WebOptimizerService } from "./web-optimizer.service";

@Injectable({
  providedIn: "root"
})
export class WebParserService {
  constructor(
    private ast: AstService,
    private xml: XmlService,
    private format: FormatService,
    private resource: ResourceService,
    private cssBlocGen: CssBlocGenService,
    private svgBlocGen: SvgBlocGenService,
    private webBlocGen: WebContextService,
    private webOptimizer: WebOptimizerService
  ) {}

  compute(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    if (!this.webBlocGen.hasContext(current)) {
      this.webBlocGen.putContext(current);
    }
    this.visit(data, current, current, 0, options);
    this.webOptimizer.optimize(current);
  }

  private visit(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number,
    options: WebBlocGenOptions
  ) {
    const className = this.generateCssClassName(options);
    this.putCss(current, root, className);
    this.putOpenTag(current, root, depth, className);
    this.putContent(data, current, root, depth, options);
    this.putClosingTag(root, depth);
  }

  private traverseLayer(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number,
    options: WebBlocGenOptions
  ) {
    if (this.webBlocGen.identify(current)) {
      current.layers.forEach(layer => {
        this.visit(data, layer, root, depth, options);
      });
    } else if (this.resource.identifySymbolInstance(current)) {
      return this.traverseSymbolMaster(data, current, root, depth, options);
    } else {
      return this.extractLayerContent(current, depth, options);
    }
  }

  private traverseSymbolMaster(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number,
    options: WebBlocGenOptions
  ) {
    const symbolMaster = this.resource.lookupSymbolMaster(current, data);

    if (symbolMaster) {
      this.compute(symbolMaster, data, options);

      const tagName = this.format.normalizeName(current.name);

      this.webBlocGen.putContext(root, {
        ...this.webBlocGen.contextOf(root),
        components: [
          ...this.webBlocGen.contextOf(root).components,
          this.format.normalizeName(tagName)
        ]
      });

      const tag = `<${tagName}/>`;

      return this.format.indent(depth, tag);
    }

    return "";
  }

  private extractLayerContent(
    current: SketchMSLayer,
    depth: number,
    options: WebBlocGenOptions
  ) {
    if (this.resource.identifyBitmap(current)) {
      return this.extractBitmap(current, depth, options);
    }
    if (this.ast.identifyText(current)) {
      return this.extractText(current, depth);
    }
    if (this.svgBlocGen.identify(current)) {
      return this.extractShape(current, depth);
    }
    return null;
  }

  private extractBitmap(
    current: SketchMSLayer,
    depth: number,
    options: WebBlocGenOptions
  ) {
    const className = this.generateCssClassName(options);
    const attributes = [
      `class="${className}"`,
      `role="${current._class}"`,
      `aria-label="${this.format.normalizeName(current.name)}"`,
      `src="${options.assetDir}/${this.format.normalizeName(current.name)}.jpg"`
    ];
    const tag = ["<img", ...attributes].join(" ") + ">";

    return this.format.indent(depth, tag);
  }

  private extractText(current: SketchMSLayer, depth: number) {
    const content = this.ast.lookupText(current);
    const tag = `<span>${content}</span>`;

    return this.format.indent(depth, tag);
  }

  private extractShape(current: SketchMSLayer, depth: number) {
    return this.svgBlocGen
      .transform(current, { xmlNamespace: false })
      .map(file =>
        file.value
          .split("\n")
          .map(line => this.format.indent(depth, line))
          .join("\n")
      )
      .join("\n");
  }

  private putContent(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number,
    options: WebBlocGenOptions
  ) {
    const content = this.traverseLayer(data, current, root, depth + 1, options);
    if (content) {
      const context = this.webBlocGen.contextOf(root);
      this.webBlocGen.putContext(root, {
        html: [...context.html, content]
      });
    }
  }

  private putCss(
    current: SketchMSLayer,
    root: SketchMSLayer,
    className: string
  ) {
    const cssRules = this.cssBlocGen
      .transform(current, { className })
      .map(file => file.value);
    const context = this.webBlocGen.contextOf(root);
    this.webBlocGen.putContext(root, {
      css: [...context.css, cssRules]
    });
  }

  private putOpenTag(
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number,
    className: string
  ) {
    const attributes = [
      `class="${className}"`,
      `role="${current._class}"`,
      `aria-label="${this.format.normalizeName(current.name)}"`
    ];
    const tag = ["<div", ...attributes].join(" ") + ">";

    const context = this.webBlocGen.contextOf(root);
    this.webBlocGen.putContext(root, {
      html: [...context.html, this.format.indent(depth, tag)]
    });
  }

  private putClosingTag(root: SketchMSLayer, depth: number) {
    const tag = this.xml.closeTag("div");

    const context = this.webBlocGen.contextOf(root);
    this.webBlocGen.putContext(root, {
      html: [...context.html, this.format.indent(depth, tag)]
    });
  }

  private generateCssClassName(options: WebBlocGenOptions) {
    const randomString = Math.random()
      .toString(36)
      .substring(2, 6);

    return `${options.cssPrefix}${randomString}`;
  }
}
