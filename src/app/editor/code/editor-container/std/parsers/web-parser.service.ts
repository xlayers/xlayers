import { Injectable } from "@angular/core";
import { BitmapParserService } from "./bitmap-parser.service";
import { SvgParserService } from "./svg-parser.service";
import { CodeGenRessourceFile as RessourceFile } from "../core.service";
import { HelperParserService } from "./helper-parser.service";
import { CssParserService } from "./css-parser.service";

interface OpenTagOptions {
  autoclose?: boolean;
}

@Injectable({
  providedIn: "root"
})
export class WebParserService {
  constructor(
    private readonly helperParserService: HelperParserService,
    private readonly cssParserService: CssParserService,
    private readonly bitmapParserService: BitmapParserService,
    private readonly svgParserService: SvgParserService
  ) {}

  transform(data: SketchMSData, current: SketchMSLayer) {
    const files = [];
    const template = [];

    this.compute(data, current, files, template);

    return [
      {
        kind: "web",
        value: template.join("\n"),
        language: "html",
        uri: current.name + ".html"
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
            return this.extractAndRegisterSvgFile(data, current, files);
          } else if (this.cssParserService.identify(current)) {
            return this.registerCssFile(data, current, files);
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
    if (
      !!this.cssParserService.getInfo(current) &&
      !!this.cssParserService.getInfo(current).rules
    ) {
      template.push(
        this.helperParserService.indent(depth, this.extractBloc(data, current))
      );
    }

    const content = this.compute(data, current, files, template, depth + 1);
    if (content) {
      template.push(this.helperParserService.indent(depth + 1, content));
    }

    if (
      !!this.cssParserService.getInfo(current) &&
      !!this.cssParserService.getInfo(current).rules
    ) {
      template.push(
        this.helperParserService.indent(depth, this.closeTag("div"))
      );
    }
  }

  private extractText(_data: SketchMSData, current: SketchMSLayer) {
    return (
      this.openTag("span") +
      current.attributedString.string +
      this.closeTag("span")
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
        return this.openTag("img", attributes, { autoclose: true });
      })
      .join("\n");
  }

  private extractBloc(
    _data: SketchMSData,
    current: SketchMSLayer,
    options?: OpenTagOptions
  ) {
    const attributes = [
      `class="${this.cssParserService.getInfo(current).className}"`,
      `role="${current._class}"`,
      `aria-label="${current.name}"`
    ];
    return this.openTag("div", attributes, options);
  }

  private extractAndRegisterSvgFile(
    data: SketchMSData,
    current: SketchMSLayer,
    files: RessourceFile[],
    _options?: OpenTagOptions
  ) {
    return this.svgParserService
      .transform(data, current)
      .map(file => {
        files.push(file);
        return `<img src="${file.uri}" alt="${current.name}"/>`;
      }, [])
      .join("\n");
  }

  private registerCssFile(
    data: SketchMSData,
    current: SketchMSLayer,
    files: RessourceFile[],
    _options?: OpenTagOptions
  ) {
    this.cssParserService.transform(data, current).map(file => {
      files.push(file);
    });
    return "";
  }

  private openTag(
    tag = "div",
    attributes: string[] = [],
    options: OpenTagOptions = {}
  ) {
    const attributeStr =
      attributes.length !== 0 ? " " + attributes.join(" ") : "";
    const autocloseStr = options.autoclose ? "/" : "";
    return `<${tag}${attributeStr} ${autocloseStr}>`;
  }

  private closeTag(tag = "div") {
    return `</${tag}>`;
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
