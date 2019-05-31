import { Injectable } from "@angular/core";
import { RessourceFile, ParserFacade, WithLocalContext } from "../blocgen";
import { XmlHelperService, OpenTagOptions } from "../xml-helper.service";
import { FormatHelperService } from "../format-helper.service";
import { CssParserService, CssParserOptions } from "./css-parser.service";
import {
  BitmapParserService,
  BitmapParserOptions
} from "./bitmap-parser.service";
import { SvgParserService, SvgParserOptions } from "./svg-parser.service";
import { TextParserService } from "./text-parser.service";

const COMPONENTS_DIR = "components";
const ASSETS_DIR = "assets";

export interface VueParserContext {}

export interface VueParserOptions {
  svg?: SvgParserOptions;
  css?: CssParserOptions;
  bitmap?: BitmapParserOptions;
}

@Injectable({
  providedIn: "root"
})
export class VueParserService
  implements ParserFacade, WithLocalContext<VueParserContext> {
  constructor(
    private readonly xmlHelperService: XmlHelperService,
    private readonly lintService: FormatHelperService,
    private readonly cssParserService: CssParserService,
    private readonly bitmapParserService: BitmapParserService,
    private readonly svgParserService: SvgParserService,
    private readonly textParserService: TextParserService
  ) {}

  private cssOptions: CssParserOptions;
  private svgOptions: SvgParserOptions;
  private bitmapOptions: BitmapParserOptions;

  identify(current: SketchMSLayer) {
    return (
      current.layers &&
      Array.isArray(current.layers) &&
      ["rect", "page", "rectangle", "group", "symbolMaster"].includes(
        current._class as string
      )
    );
  }

  hasContext(current: SketchMSLayer) {
    return !!(current as any).vue;
  }

  contextOf(current: SketchMSLayer) {
    return (current as any).vue;
  }

  attachContext(current: SketchMSLayer) {
    (current as any).vue = { html: [], css: [], imports: [] };
  }

  transform(
    data: SketchMSData,
    current: SketchMSLayer,
    options: VueParserOptions = {}
  ) {
    this.svgOptions = options.svg || {};
    this.bitmapOptions = options.bitmap || {};
    this.cssOptions = options.css || {};

    const files: RessourceFile[] = [];
    this.attachContext(current);
    this.compute(data, current, current, files);
    files.push({
      kind: "vue",
      value: this.renderComponentTemplate(
        this.contextOf(current).html,
        this.contextOf(current).css,
        this.contextOf(current).imports
      ),
      language: "html",
      uri: `${COMPONENTS_DIR}/${current.name}.vue`
    });
    files.push({
      kind: "vue",
      value: this.renderComponentSpecTemplate(
        `${COMPONENTS_DIR}/${current.name}`
      ),
      language: "javascript",
      uri: `${COMPONENTS_DIR}/${current.name}.spec.js`
    });
    return files;
  }

  private compute(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    files: RessourceFile[],
    depth: number = 0
  ) {
    if (this.identify(current)) {
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
        if (this.svgParserService.identify(current)) {
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
    const cssRules = this.extractCssRule(data, current);

    if (cssRules) {
      this.contextOf(root).css.push(cssRules);
      this.contextOf(root).html.push(
        this.lintService.indent(depth, this.extractCssOpenTag(current))
      );
    } else {
      this.contextOf(root).html.push(
        this.lintService.indent(depth, this.extractOpenTag(current))
      );
    }

    const content = this.compute(data, current, root, files, depth + 1);
    if (content) {
      this.contextOf(root).html.push(
        this.lintService.indent(depth + 1, content)
      );
    }

    this.contextOf(root).html.push(
      this.lintService.indent(depth, this.xmlHelperService.closeTag("div"))
    );
  }

  private extractCssOpenTag(current: SketchMSLayer, options?: OpenTagOptions) {
    const context = this.cssParserService.contextOf(current);
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

  private extractCssRule(data: SketchMSData, current: SketchMSLayer) {
    const cssRules = this.cssParserService
      .transform(data, current, this.cssOptions)
      .reduce((acc, file) => acc + file.value, "");

    if (!cssRules) {
      return "";
    }

    const context = this.cssParserService.contextOf(current);
    return [context.className + " {", cssRules, "}"].join("\n");
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
    const context = this.cssParserService.contextOf(current);

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
          `class="${this.cssParserService.contextOf(current).className}"`,
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
    // this.contextOf(root).css.push(
    //   [
    //     this.cssParserService.contextOf(current).className + " {",
    //     "  border-radius: 50%",
    //     "}"
    //   ].join("\n")
    // );
    // return this.xmlHelperService.openTag(
    //   "div",
    //   [`class="${this.cssParserService.contextOf(current).className}"`],
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

    this.transform(data, foreignSymbol.symbolMaster).forEach(file => {
      if (file.kind === "vue" && file.uri.endsWith(".vue")) {
        this.contextOf(root).imports.push(current.name);
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

  private renderComponentSpecTemplate(path: string) {
    const capitalizedName = path.charAt(0).toUpperCase() + path.slice(1);

    return `\
import { shallowMount } from "@vue/test-utils";
import ${capitalizedName} from "@/components/${path}.vue";
import { componentSpecTemplate } from '../codegen/vue/vue.template';
import { SketchMSData } from '../../../../core/sketch.service';

describe("${capitalizedName}", () => {
  it("render", () => {
    const wrapper = shallowMount(${capitalizedName}, {});
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});`;
  }

  private renderComponentTemplate(
    html: string[],
    css: string[],
    components: string[]
  ) {
    const script =
      components.length === 0
        ? `\
export default {}`
        : `\
${components
  .map(component => `import ${component} from "components/${component}"`)
  .join("\n")}

export default {
  components: {
    ${components.join(",\n    ")}
  }
}`;

    return `\
<template>
${html.join("\n")}
</template>

<script>
${script}
</script>

<style>
${css.join("\n")}
</style>`;
  }
}
