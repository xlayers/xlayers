import { Injectable } from "@angular/core";
import { BitmapParserService } from "./bitmap-parser.service";
import { SvgParserService, SvgParserOptions } from "./svg-parser.service";
import { CodeGenRessourceFile as RessourceFile } from "../blocgen";
import { LintService } from "../lint.service";
import { CssParserService, CssParserOptions } from "./css-parser.service";
import { XmlService, OpenTagOptions } from "../xml.service";

export interface WebParserOptions {
  htmlDist?: string;
  assetDist?: string;
  svg?: SvgParserOptions;
  css?: CssParserOptions;
}

@Injectable({
  providedIn: "root"
})
export class WebParserService {
  constructor(
    private readonly xmlService: XmlService,
    private readonly lintService: LintService,
    private readonly cssParserService: CssParserService,
    private readonly bitmapParserService: BitmapParserService,
    private readonly svgParserService: SvgParserService
  ) {}

  private assetDist: string;
  private htmlDist: string;
  private cssOptions: CssParserOptions;
  private svgOptions: SvgParserOptions;

  transform(
    data: SketchMSData,
    current: SketchMSLayer,
    options?: WebParserOptions
  ) {
    this.htmlDist = options.htmlDist || "";
    this.assetDist = options.assetDist || "";
    this.cssOptions = options.css || { cssDist: this.assetDist };
    this.svgOptions = options.svg || {};

    const files = [];
    const template = [];

    this.compute(data, current, files, template);

    return [
      {
        kind: "web",
        value: template.join("\n"),
        language: "html",
        uri: `${this.htmlDist}/${current.name}.html`
      },
      ...files
    ];
  }

  identify(current: SketchMSLayer) {
    return (
      current.layers &&
      Array.isArray(current.layers) &&
      ((current._class as string) === "rect" ||
        (current._class as string) === "page" ||
        (current._class as string) === "rectangle" ||
        (current._class as string) === "group")
    );
  }

  getInfo(current: SketchMSLayer) {
    return (current as any).web;
  }

  private compute(
    data: SketchMSData,
    current: SketchMSLayer,
    files: RessourceFile[],
    template: string[],
    depth: number = 0
  ) {
    if (this.identify(current)) {
      current.layers.forEach(layer => {
        this.visit(data, layer, files, template, depth);
      });
    } else {
      switch (current._class as string) {
        case "text":
          return this.extractText(data, current);
        case "bitmap":
          return this.extractImage(data, current);
        default:
          if (this.svgParserService.identify(current)) {
            return this.extractImgAndRegisterSvgFile(data, current, files);
          }
          return null;
      }
    }
  }

  private visit(
    data: SketchMSData,
    current: SketchMSLayer,
    files: RessourceFile[],
    template: string[],
    depth: number
  ) {
    if (this.cssParserService.identify(current)) {
      template.push(
        this.lintService.indent(
          depth,
          this.extractDivAndregisterCssFile(data, current, files)
        )
      );
    }

    const content = this.compute(data, current, files, template, depth + 1);
    if (content) {
      template.push(this.lintService.indent(depth + 1, content));
    }

    if (this.cssParserService.identify(current)) {
      template.push(
        this.lintService.indent(depth, this.xmlService.closeTag("div"))
      );
    }
  }

  private extractText(_data: SketchMSData, current: SketchMSLayer) {
    return (
      this.xmlService.openTag("span") +
      current.attributedString.string +
      this.xmlService.closeTag("span")
    );
  }

  private extractImage(data: SketchMSData, current: SketchMSLayer) {
    return this.bitmapParserService
      .transform(data, current)
      .map(file => {
        const base64Content = file.value.replace("data:image/png;base64", "");

        const attributes = [
          `class="${this.cssParserService.getInfo(current).className}"`,
          `role="${current._class}"`,
          `aria-label="${current.name}"`,
          `src="${this.buildImageSrc(base64Content, false)}"`
        ];
        return this.xmlService.openTag("img", attributes, { autoclose: true });
      })
      .join("\n");
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
          uri: `${this.assetDist}/${file.uri}`
        });

        return `<img src="${this.assetDist}/${file.uri}" alt="${
          current.name
        }"/>`;
      }, [])
      .join("\n");
  }

  private extractDivAndregisterCssFile(
    data: SketchMSData,
    current: SketchMSLayer,
    files: RessourceFile[],
    options?: OpenTagOptions
  ) {
    this.cssParserService
      .transform(data, current, this.cssOptions)
      .map(file => {
        files.push({
          ...file,
          uri: `${this.htmlDist}/${current.name}`
        });
      });

    const attributes = [
      `class="${this.cssParserService.getInfo(current).className}"`,
      `role="${current._class}"`,
      `aria-label="${current.name}"`
    ];
    return this.xmlService.openTag("div", attributes, options);
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

  /**
   * Convert a Base64 content into a Blob type.
   * @param base64Data The image data encoded as Base64
   * @param contentType The desired MIME type of the result image
   */
  private base64toBlob(base64Data: string, contentType = "image/png") {
    const blob = new Blob([base64Data], { type: contentType });
    return blob;
  }
}
