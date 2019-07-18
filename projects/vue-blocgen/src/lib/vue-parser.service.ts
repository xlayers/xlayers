import { Injectable } from "@angular/core";
import {
  XmlService,
  FormatService,
  ResourceService
} from "@xlayers/sketch-util";
import { CssBlocGenService } from "@xlayers/css-blocgen";
import { SvgBlocGenService } from "@xlayers/svg-blocgen";
import { AstService } from "@xlayers/sketch-util";
import { VueContextService } from "./vue-context.service";
import { VueBlocGenOptions } from "@xlayers/vue-blocgen";

@Injectable({
  providedIn: "root"
})
export class VueParserService {
  constructor(
    private astService: AstService,
    private xmlService: XmlService,
    private formatService: FormatService,
    private resourceService: ResourceService,
    private cssBlocGenService: CssBlocGenService,
    private svgBlocGenService: SvgBlocGenService,
    private vueBlocGenService: VueContextService
  ) {}

  compute(
    data: SketchMSData,
    current: SketchMSLayer,
    options: VueBlocGenOptions
  ) {
    if (!this.vueBlocGenService.hasContext(current)) {
      this.vueBlocGenService.putContext(current);
    }
    this.visit(data, current, current, 0, options);
  }

  private visit(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number,
    options: VueBlocGenOptions
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
    options: VueBlocGenOptions
  ) {
    if (this.vueBlocGenService.identify(current)) {
      current.layers.forEach(layer => {
        this.visit(data, layer, root, depth, options);
      });
    } else if (this.resourceService.identifySymbolInstance(current)) {
      return this.traverseSymbolMaster(
        data,
        current,
        root,
        depth,
        options
      );
    } else {
      return this.extractLayerContent(current, depth, options);
    }
  }

  private traverseSymbolMaster(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number,
    options: VueBlocGenOptions
  ) {
    const symbolMaster = this.resourceService.lookupSymbolMaster(current, data);

    if (symbolMaster) {
      this.compute(data, symbolMaster, options);

      const tagName = this.formatService.normalizeName(current.name);

      this.vueBlocGenService.putContext(root, {
        ...this.vueBlocGenService.contextOf(root),
        components: [
          ...this.vueBlocGenService.contextOf(root).components,
          this.formatService.normalizeName(tagName)
        ]
      });

      const tag = `<${tagName}/>`;

      return this.formatService.indent(depth, tag);
    }

    return "";
  }

  private extractLayerContent(
    current: SketchMSLayer,
    depth: number,
    options: VueBlocGenOptions
  ) {
    if (this.resourceService.identifyBitmap(current)) {
      return this.extractBitmap(current, depth, options);
    }
    if (this.astService.identifyText(current)) {
      return this.extractText(current, depth);
    }
    if (this.svgBlocGenService.identify(current)) {
      return this.extractShape(current, depth);
    }
    return null;
  }

  private extractBitmap(
    current: SketchMSLayer,
    depth: number,
    options: VueBlocGenOptions
  ) {
    const className = this.generateCssClassName(options);
    const attributes = [
      `class="${className}"`,
      `role="${current._class}"`,
      `aria-label="${this.formatService.normalizeName(current.name)}"`,
      `src="${options.assetDir}/${this.formatService.normalizeName(
        current.name
      )}.jpg"`
    ];
    const tag = ["<img", ...attributes].join(" ") + ">";

    return this.formatService.indent(depth, tag);
  }

  private extractText(current: SketchMSLayer, depth: number) {
    const content = this.astService.lookupText(current);
    const tag = `<span>${content}</span>`;

    return this.formatService.indent(depth, tag);
  }

  private extractShape(current: SketchMSLayer, depth: number) {
    return this.svgBlocGenService
      .transform(current, { xmlNamespace: false })
      .map(file =>
        file.value
          .split("\n")
          .map(line => this.formatService.indent(depth, line))
          .join("\n")
      )
      .join("\n");
  }

  private putContent(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number,
    options: VueBlocGenOptions
  ) {
    const content = this.traverseLayer(data, current, root, depth + 1, options);
    if (content) {
      const context = this.vueBlocGenService.contextOf(root);
      this.vueBlocGenService.putContext(root, {
        html: [...context.html, content]
      });
    }
  }

  private putCss(
    current: SketchMSLayer,
    root: SketchMSLayer,
    className: string
  ) {
    const cssRules = this.cssBlocGenService
      .transform(current, { className })
      .map(file => file.value);
    const context = this.vueBlocGenService.contextOf(root);
    this.vueBlocGenService.putContext(root, {
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
      `aria-label="${this.formatService.normalizeName(current.name)}"`
    ];
    const tag = ["<div", ...attributes].join(" ") + ">";

    const context = this.vueBlocGenService.contextOf(root);
    this.vueBlocGenService.putContext(root, {
      html: [...context.html, this.formatService.indent(depth, tag)]
    });
  }

  private putClosingTag(root: SketchMSLayer, depth: number) {
    const tag = this.xmlService.closeTag("div");

    const context = this.vueBlocGenService.contextOf(root);
    this.vueBlocGenService.putContext(root, {
      html: [...context.html, this.formatService.indent(depth, tag)]
    });
  }

  private generateCssClassName(options: VueBlocGenOptions) {
    const randomString = Math.random()
      .toString(36)
      .substring(2, 6);

    return `${options.prefix}${randomString}`;
  }
}
