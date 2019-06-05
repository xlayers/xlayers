import { Injectable } from "@angular/core";
import { XmlService, OpenTagOptions, RessourceFile } from "@xlayers/std-blocgen";
import { FormatService } from "@xlayers/std-blocgen";
import {
  CssBlocGenService,
  CssBlocGenOptions
} from "@xlayers/css-blocgen";
import {
  BitmapBlocGenService,
  BitmapBlocGenOptions
} from "@xlayers/bitmap-blocgen";
import {
  SvgBlocGenService,
  SvgParserOptions
} from "@xlayers/svg-blocgen";
import { TextBlocGenService } from "@xlayers/text-blocgen";
import { VueContextService } from "./vue-context.service";
import { SvgContextService } from "@xlayers/svg-blocgen";
import { CssContextService } from "@xlayers/css-blocgen";

const ASSETS_DIR = "assets";

@Injectable({
  providedIn: "root"
})
export class VueParserService {
  constructor(
    private readonly xmlHelperService: XmlService,
    private readonly lintService: FormatService,
    private readonly cssParserService: CssBlocGenService,
    private readonly bitmapParserService: BitmapBlocGenService,
    private readonly svgParserService: SvgBlocGenService,
    private readonly vueContextService: VueContextService,
    private readonly textParserService: TextBlocGenService,
    private readonly cssContextService: CssContextService,
    private readonly svgContextService: SvgContextService
  ) {}

  private cssOptions: CssBlocGenOptions;
  private svgOptions: SvgParserOptions;
  private bitmapOptions: BitmapBlocGenOptions;

  compute(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    files: RessourceFile[],
    depth: number = 0
  ) {
    if (this.vueContextService.identify(current)) {
      current.layers.forEach(layer => {
        this.computeIntermediateLayer(data, layer, root, files, depth);
      });
    } else {
      return this.computeEdgeLayer(data, current, root, files);
    }
  }

  private computeEdgeLayer(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    files: RessourceFile[]
  ) {
    switch (current._class as string) {
      case "text":
        return this.extractText(data, current);
      case "bitmap":
        return this.extractImage(data, current);
      case "symbolInstance":
        return this.extractAndRegisterSymbolMaster(data, current, root, files);
      case "oval":
        return this.extractOvalSolid(current, root);
      default:
        if (this.svgContextService.identify(current)) {
          return this.extractImgAndRegisterSvgFile(data, current, files);
        }
        return null;
    }
  }

  private computeIntermediateLayer(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    files: RessourceFile[],
    depth: number
  ) {
    const cssRules = this.cssParserService
      .transform(data, current, this.cssOptions)
      .map(file => file.value);

    if (cssRules) {
      this.vueContextService.contextOf(root).css.push(cssRules);
      this.vueContextService
        .contextOf(root)
        .html.push(
          this.lintService.indent(depth, this.extractCssOpenTag(current))
        );
    } else {
      this.vueContextService
        .contextOf(root)
        .html.push(
          this.lintService.indent(depth, this.extractOpenTag(current))
        );
    }

    const content = this.compute(data, current, root, files, depth + 1);
    if (content) {
      this.vueContextService
        .contextOf(root)
        .html.push(this.lintService.indent(depth + 1, content));
    }

    this.vueContextService
      .contextOf(root)
      .html.push(
        this.lintService.indent(depth, this.xmlHelperService.closeTag("div"))
      );
  }

  private extractCssOpenTag(current: SketchMSLayer, options?: OpenTagOptions) {
    const context = this.cssContextService.contextOf(current);
    const attributes = [
      `class="${context.className}"`,
      `role="${current._class}"`,
      `aria-label="${current.name}"`
    ];
    return this.xmlHelperService.openTag("div", attributes, options);
  }

  private extractOpenTag(current: SketchMSLayer, options?: OpenTagOptions) {
    const attributes = [
      `role="${current._class}"`,
      `aria-label="${current.name}"`
    ];
    return this.xmlHelperService.openTag("div", attributes, options);
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
      .transform(data, current, this.bitmapOptions)
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

  private extractOvalSolid(current: SketchMSLayer, root: SketchMSLayer) {
    // this.vueContextService.contextOf(root).css.push(
    //   [
    //     this.vueContextService.contextOf(current).className + " {",
    //     "  border-radius: 50%",
    //     "}"
    //   ].join("\n")
    // );
    // return this.xmlHelperService.openTag(
    //   "div",
    //   [`class="${this.vueContextService.contextOf(current).className}"`],
    //   { autoclose: true }
    // );
  }

  private extractAndRegisterSymbolMaster(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    files: RessourceFile[]
  ) {
    const foreignSymbol = data.document.foreignSymbols.find(
      x => x.symbolMaster.symbolID === (current as any).symbolID
    );

    if (!foreignSymbol) {
      return null;
    }

    const vueFiles = [];
    this.compute(
      data,
      foreignSymbol.symbolMaster,
      foreignSymbol.symbolMaster,
      vueFiles
    );

    vueFiles.forEach(file => {
      if (file.kind === "vue" && file.uri.endsWith(".vue")) {
        this.vueContextService.contextOf(root).imports.push(current.name);
      }
      files.push(file);
    });

    return this.xmlHelperService.openTag(current.name, [], {
      autoclose: true
    });
  }

  private extractImgAndRegisterSvgFile(
    data: SketchMSData,
    current: SketchMSLayer,
    files: RessourceFile[]
  ) {
    return this.svgParserService
      .transform(data, current, this.svgOptions)
      .map(file => {
        files.push({
          ...file,
          kind: "vue",
          uri: `${ASSETS_DIR}/${file.uri}`
        });

        return `<img src="${ASSETS_DIR}/${file.uri}" alt="${current.name}"/>`;
      }, [])
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
