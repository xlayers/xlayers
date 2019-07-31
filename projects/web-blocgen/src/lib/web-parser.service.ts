import { Injectable } from "@angular/core";
import {
  ImageService,
  FormatService,
  SymbolService
} from "@xlayers/sketch-lib";
import { CssBlocGenService } from "@xlayers/css-blocgen";
import { SvgBlocGenService } from "@xlayers/svg-blocgen";
import { TextService } from "@xlayers/sketch-lib";
import { WebBlocGenOptions } from "./web-blocgen.d";
import { WebContextService } from "./web-context.service";

@Injectable({
  providedIn: "root"
})
export class WebParserService {
  constructor(
    private text: TextService,
    private format: FormatService,
    private symbol: SymbolService,
    private image: ImageService,
    private cssBlocGen: CssBlocGenService,
    private svgBlocGen: SvgBlocGenService,
    private webContext: WebContextService
  ) {}

  compute(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebBlocGenOptions
  ) {
    if (!this.webContext.hasContext(current)) {
      this.webContext.putContext(current);
    }
    this.visit(data, current, current, 0, options);
  }

  private visit(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number,
    options: WebBlocGenOptions
  ) {
    const className = this.generateCssClassName(options);
    this.putStyle(current, className);
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
    if (this.webContext.identify(current)) {
      current.layers.forEach(layer => {
        this.visit(data, layer, root, depth, options);
      });
    } else if (this.symbol.identify(current)) {
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
    const symbolMaster = this.symbol.lookup(current, data);

    if (symbolMaster) {
      this.compute(symbolMaster, data, options);

      const tagName = this.format.fileName(current.name);

      this.webContext.putContext(root, {
        ...this.webContext.contextOf(root),
        components: [...this.webContext.contextOf(root).components, tagName]
      });

      const tag = `<${tagName}/>`;

      return [this.format.indent(depth, tag)];
    }

    return "";
  }

  private extractLayerContent(
    current: SketchMSLayer,
    depth: number,
    options: WebBlocGenOptions
  ) {
    if (this.image.identify(current)) {
      return this.extractBitmap(current, depth, options);
    }
    if (this.text.identify(current)) {
      return this.extractText(current, depth);
    }
    if (this.svgBlocGen.identify(current)) {
      return this.extractShape(current, depth);
    }
    return [];
  }

  private extractBitmap(
    current: SketchMSLayer,
    depth: number,
    options: WebBlocGenOptions
  ) {
    const className = this.generateCssClassName(options);
    const attributes = [
      `${options.jsx ? "className" : "class"}="${className}"`,
      `role="${current._class}"`,
      `aria-label="${current.name}"`,
      `src="${options.assetDir}/${this.format.fileName(current.name)}.jpg"`
    ];
    const tag = ["<img", ...attributes].join(" ") + ">";

    return [this.format.indent(depth, tag)];
  }

  private extractText(current: SketchMSLayer, depth: number) {
    const content = this.text.lookup(current);
    const tag = `<span>${content}</span>`;

    return [this.format.indent(depth, tag)];
  }

  private extractShape(current: SketchMSLayer, depth: number) {
    return this.svgBlocGen
      .transform(current, { xmlNamespace: false })
      .flatMap(file =>
        file.value.split("\n").map(line => this.format.indent(depth, line))
      );
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
      const context = this.webContext.contextOf(root);
      this.webContext.putContext(root, {
        html: [...context.html, ...content]
      });
    }
  }

  private putStyle(current: SketchMSLayer, className: string) {
    const css = this.cssBlocGen
      .transform(current)
      .flatMap(file => file.value.split("\n"));

    this.webContext.putContext(current, {
      className,
      css
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
      `aria-label="${current.name}"`
    ];
    const tag = ["<div", ...attributes].join(" ") + ">";

    const context = this.webContext.contextOf(root);
    this.webContext.putContext(root, {
      html: [...context.html, this.format.indent(depth, tag)]
    });
  }

  private putClosingTag(root: SketchMSLayer, depth: number) {
    const context = this.webContext.contextOf(root);
    this.webContext.putContext(root, {
      html: [...context.html, this.format.indent(depth, "</div>")]
    });
  }

  private generateCssClassName(options: WebBlocGenOptions) {
    const randomString = Math.random()
      .toString(36)
      .substring(2, 6);

    return `${options.cssPrefix}${randomString}`;
  }
}
