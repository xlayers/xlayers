import { Injectable } from "@angular/core";
import { XmlService, OpenTagOptions } from "@xlayers/std-blocgen";
import { FormatService } from "@xlayers/std-blocgen";
import { CssBlocGenService } from "@xlayers/css-blocgen";
import { BitmapBlocGenService } from "@xlayers/bitmap-blocgen";
import { SvgBlocGenService } from "@xlayers/svg-blocgen";
import { TextBlocGenService } from "@xlayers/text-blocgen";
import { VueContextService } from "./vue-context.service";
import { SvgContextService } from "@xlayers/svg-blocgen";
import { CssContextService } from "@xlayers/css-blocgen";
import { TextContextService } from "../../../text-blocgen/src/lib/text-context.service";
import { BitmapContextService } from "../../../bitmap-blocgen/src/lib/bitmap-context.service";
import { VueBlocGenOptions } from "./vue-blocgen.service";

@Injectable({
  providedIn: "root"
})
export class VueParserService {
  constructor(
    private xmlHelperService: XmlService,
    private lintService: FormatService,
    private cssParserService: CssBlocGenService,
    private bitmapParserService: BitmapBlocGenService,
    private bitmapContextService: BitmapContextService,
    private svgParserService: SvgBlocGenService,
    private vueContextService: VueContextService,
    private textParserService: TextBlocGenService,
    private textContextService: TextContextService,
    private cssContextService: CssContextService,
    private svgContextService: SvgContextService
  ) {}

  private assetDir: string;

  compute(
    data: SketchMSData,
    current: SketchMSLayer,
    opts?: VueBlocGenOptions
  ) {
    this.assetDir = (opts && opts.assetDir) || "assets";
    this.vueContextService.putContext(current);
    this.traverse(data, current, current);
  }

  traverse(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number = 0
  ) {
    if (this.vueContextService.identify(current)) {
      current.layers.forEach(layer => {
        this.traverseIntermediateLayer(data, layer, root, depth);
      });
    } else {
      return this.traverseEdgeLayer(data, current);
    }
  }

  private traverseEdgeLayer(data: SketchMSData, current: SketchMSLayer) {
    if ((current._class as string) === "symbolInstance") {
      return this.extractSymbolMaster(data, current);
    }
    if (this.bitmapContextService.identify(current)) {
      return this.extractImage(data, current);
    }
    if (this.textContextService.identify(current)) {
      return this.extractText(data, current);
    }
    if (this.svgContextService.identify(current)) {
      return this.extractShape(data, current);
    }
    return null;
  }

  private traverseIntermediateLayer(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    depth: number
  ) {
    if (this.cssContextService.identify(current)) {
      const cssRules = this.cssParserService
        .transform(data, current)
        .map(file => file.value);

      this.vueContextService.putContext(root, {
        ...this.vueContextService.contextOf(root),
        css: [...this.vueContextService.contextOf(root).css, ...cssRules]
      });
      this.vueContextService.putContext(root, {
        ...this.vueContextService.contextOf(root),
        html: [
          ...this.vueContextService.contextOf(root).html,
          this.lintService.indent(depth, this.extractCssOpenTag(current))
        ]
      });
    } else {
      this.vueContextService.putContext(root, {
        ...this.vueContextService.contextOf(root),
        html: [
          ...this.vueContextService.contextOf(root).html,
          this.lintService.indent(depth, this.extractOpenTag(current))
        ]
      });
    }

    const content = this.traverse(data, current, root, depth + 1);
    if (content) {
      this.vueContextService.putContext(root, {
        ...this.vueContextService.contextOf(root),
        html: [
          ...this.vueContextService.contextOf(root).html,
          this.lintService.indent(depth + 1, content)
        ]
      });
    }

    this.vueContextService.putContext(root, {
      ...this.vueContextService.contextOf(root),
      html: [
        ...this.vueContextService.contextOf(root).html,
        this.lintService.indent(depth, this.xmlHelperService.closeTag("div"))
      ]
    });
  }

  private extractCssOpenTag(current: SketchMSLayer, opts?: OpenTagOptions) {
    const context = this.cssContextService.contextOf(current);
    const attributes = [
      `class="${context.className}"`,
      `role="${current._class}"`,
      `aria-label="${current.name}"`
    ];
    return this.xmlHelperService.openTag("div", attributes, opts);
  }

  private extractOpenTag(current: SketchMSLayer, opts?: OpenTagOptions) {
    const attributes = [
      `role="${current._class}"`,
      `aria-label="${current.name}"`
    ];
    return this.xmlHelperService.openTag("div", attributes, opts);
  }

  private extractText(data: SketchMSData, current: SketchMSLayer) {
    return this.textParserService
      .transform(data, current)
      .map(
        file =>
          this.xmlHelperService.openTag("span") +
          file.value +
          this.xmlHelperService.closeTag("span")
      )
      .join("\n");
  }

  private extractImage(data: SketchMSData, current: SketchMSLayer) {
    const context = this.vueContextService.contextOf(current);

    if (!context) {
      return this.xmlHelperService.openTag("img", [], {
        autoclose: true
      });
    }

    return this.bitmapParserService
      .transform(data, current)
      .map(file => {
        const base64Content = file.value.replace("data:image/png;base64", "");

        const attributes = [
          `class="${this.vueContextService.contextOf(current).className}"`,
          `role="${current._class}"`,
          `aria-label="${current.name}"`,
          `src="${this.buildImageSrc(base64Content, false)}"`
        ];
        return this.xmlHelperService.openTag("img", attributes, {
          autoclose: true
        });
      })
      .join("\n");
  }

  private extractSymbolMaster(data: SketchMSData, current: SketchMSLayer) {
    const foreignSymbol = data.document.foreignSymbols.find(
      x => x.symbolMaster.symbolID === (current as any).symbolID
    );

    this.compute(data, foreignSymbol.symbolMaster);

    return this.xmlHelperService.openTag(current.name, [], {
      autoclose: true
    });
  }

  private extractShape(data: SketchMSData, current: SketchMSLayer) {
    return this.svgParserService
      .transform(data, current)
      .map(
        file =>
          `<img src="${[this.assetDir, file.uri].join("/")}" alt="${
            current.name
          }"/>`
      )
      .join("\n");
  }

  /**
   * Convert a Base64 content into a Blob type.
   * @param base64Data The image data encoded as Base64
   * @param contentType The desired MIME type of the result image
   */
  private base64toBlob(base64Data: string, contentType = "image/png") {
    const blob = new Blob([base64Data], { type: contentType });
    return blob;
  }

  /**
   * Get the image source for the codegen.
   * @param base64Data The image data encoded as Base64
   * @param useBlob Should we convert to a Blob type
   */
  private buildImageSrc(base64Data: string, useBlob = true) {
    if (useBlob) {
      const blob = this.base64toBlob(base64Data, "image/png");
      return URL.createObjectURL(blob);
    }

    // use fallback output
    return base64Data;
  }
}
