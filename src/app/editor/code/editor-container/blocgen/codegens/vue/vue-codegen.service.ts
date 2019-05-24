import { Injectable } from "@angular/core";
import { XlayersNgxEditorModel } from "../../../codegen/codegen.service";
import { RessourceFile, CodeGenFacade, ParserFacade } from "../../blocgen";
import { XmlService } from "../../xml.service";
import { LintService } from "../../lint.service";
import { CssParserService } from "../../parsers/css-parser.service";
import { BitmapParserService } from "../../parsers/bitmap-parser.service";
import { SvgParserService } from "../../parsers/svg-parser.service";
import {
  VueComponentBuilder,
  readmeTemplate,
  componentTemplate,
  componentSpecTemplate
} from "./vue-codegen.template";

const COMPONENTS_DIR = "components";
const ASSETS_DIR = "assets";

@Injectable({
  providedIn: "root"
})
export class VueCodeGenService implements CodeGenFacade, ParserFacade {
  constructor(
    private readonly xmlService: XmlService,
    private readonly lintService: LintService,
    private readonly cssParserService: CssParserService,
    private readonly bitmapParserService: BitmapParserService,
    private readonly svgParserService: SvgParserService
  ) {}

  buttons() {
    return {};
  }

  generate(data: SketchMSData) {
    const files = (data.pages as any).flatMap(page =>
      this.transform(data, page)
    );

    return [
      {
        kind: "vue",
        value: readmeTemplate(data.meta.app),
        language: "markdown",
        uri: `README.md`
      },
      ...files
    ] as XlayersNgxEditorModel[];
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

  getInfos(current: SketchMSLayer) {
    return (current as any).vue;
  }

  transform(data: SketchMSData, current: SketchMSLayer) {
    const files: RessourceFile[] = [];
    this.compute(data, current, files);
    return files;
  }

  transformWebFile(file: RessourceFile) {
    const pathFilename = file.uri
      .split(".")
      .slice(0, -1)
      .join(".");

    return [
      {
        kind: "vue",
        value: componentTemplate(file.value, ""),
        uri: `${pathFilename}.vue`
      },
      {
        kind: "vue",
        value: componentSpecTemplate(pathFilename),
        language: "javascript",
        uri: `${pathFilename}.spec.js`
      }
    ];
  }

  private compute(
    data: SketchMSData,
    current: SketchMSLayer,
    files: RessourceFile[],
    template: VueComponentBuilder = null,
    depth: number = 0
  ) {
    if (this.identify(current)) {
      current.layers.forEach(layer => {
        this.computeIntermediateNode(current, template, files, (nextTemplate) => {
          this.visit(data, layer, files, nextTemplate, depth);
        });
      });
    } else {
      return this.computeEdgeNodeData(data, current, files);
    }
  }

  private computeEdgeNodeData(
    data: SketchMSData,
    current: SketchMSLayer,
    files: RessourceFile[]
  ) {
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

  private computeIntermediateNode(
    current: SketchMSLayer,
    template: VueComponentBuilder,
    files: RessourceFile[],
    next: Function
  ) {
    const nextTemplate =
      !template || (current._class as string) === "rect"
        ? new VueComponentBuilder()
        : template;

    next(nextTemplate);
    if (nextTemplate !== template) {
      files.push({
        kind: "vue",
        value: nextTemplate.build(),
        language: "html",
        uri: `${COMPONENTS_DIR}/${current.name}.vue`
      });
    }
  }

  private visit(
    data: SketchMSData,
    current: SketchMSLayer,
    files: RessourceFile[],
    template: VueComponentBuilder,
    depth: number
  ) {
    if (this.cssParserService.identify(current)) {
      template.appendCss(
        this.cssParserService.getInfos(current).className + " {"
      );
      this.cssParserService.transform(data, current).map(file => {
        template.appendCss(file.value);
      });
      template.appendCss("}");

      const attributes = [
        `class="${this.cssParserService.getInfos(current).className}"`,
        `role="${current._class}"`,
        `aria-label="${current.name}"`
      ];
      template.appendHtml(
        this.lintService.indent(
          depth,
          this.xmlService.openTag("div", attributes)
        )
      );
    }

    const content = this.compute(data, current, files, template, depth + 1);
    if (content) {
      template.appendHtml(this.lintService.indent(depth + 1, content));
    }

    if (this.cssParserService.identify(current)) {
      template.appendHtml(
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
          `class="${this.cssParserService.getInfos(current).className}"`,
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
      .transform(data, current)
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
