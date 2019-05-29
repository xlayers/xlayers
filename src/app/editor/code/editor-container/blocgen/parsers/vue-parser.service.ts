import { Injectable } from "@angular/core";
import { RessourceFile, ParserFacade } from "../blocgen";
import { XmlService } from "../xml.service";
import { LintService } from "../lint.service";
import { CssParserService } from "./css-parser.service";
import { BitmapParserService } from "./bitmap-parser.service";
import { SvgParserService } from "./svg-parser.service";

const COMPONENTS_DIR = "components";
const ASSETS_DIR = "assets";

const componentSpecTemplate = (path: string) => {
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
};

const componentTemplate = (
  html: string[],
  css: string[],
  components: string[]
) => {
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
    ${components.join("    ,\n")}
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
};

/**
 * Convert a Base64 content into a Blob type.
 * @param base64Data The image data encoded as Base64
 * @param contentType The desired MIME type of the result image
 */
const base64toBlob = (base64Data: string, contentType = "image/png") => {
  const blob = new Blob([base64Data], { type: contentType });
  return blob;
};

/**
 * Get the image source for the codegen.
 * @param base64Data The image data encoded as Base64
 * @param useBlob Should we convert to a Blob type
 */
const buildImageSrc = (base64Data: string, useBlob = true) => {
  if (useBlob) {
    const blob = base64toBlob(base64Data, "image/png");
    return URL.createObjectURL(blob);
  }

  // use fallback output
  return base64Data;
};

@Injectable({
  providedIn: "root"
})
export class VueParserService implements ParserFacade {
  constructor(
    private readonly xmlService: XmlService,
    private readonly lintService: LintService,
    private readonly cssParserService: CssParserService,
    private readonly bitmapParserService: BitmapParserService,
    private readonly svgParserService: SvgParserService
  ) {}

  identify(current: SketchMSLayer) {
    return (
      current.layers &&
      Array.isArray(current.layers) &&
      ((current._class as string) === "rect" ||
        (current._class as string) === "page" ||
        (current._class as string) === "rectangle" ||
        (current._class as string) === "group" ||
        (current._class as string) === "symbolMaster")
    );
  }

  contextOf(current: SketchMSLayer) {
    return (current as any).vue;
  }

  attachContext(current: SketchMSLayer) {
    (current as any).vue = { html: [], css: [], imports: [] };
  }

  transform(data: SketchMSData, current: SketchMSLayer) {
    const files: RessourceFile[] = [];
    this.attachContext(current);
    this.compute(data, current, current, files);
    files.push({
      kind: "vue",
      value: componentTemplate(
        this.contextOf(current).html,
        this.contextOf(current).css,
        this.contextOf(current).imports
      ),
      language: "html",
      uri: `${COMPONENTS_DIR}/${current.name}.vue`
    });
    files.push({
      kind: "vue",
      value: componentSpecTemplate(`${COMPONENTS_DIR}/${current.name}`),
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
        this.computeIntermediateNode(data, layer, root, files, depth);
      });
    } else {
      return this.computeEdgeNodeData(data, current, root, files);
    }
  }

  private computeEdgeNodeData(
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
      default:
        if (this.svgParserService.identify(current)) {
          return this.extractImgAndRegisterSvgFile(data, current, files);
        }
        return null;
    }
  }

  private computeIntermediateNode(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    files: RessourceFile[],
    depth: number
  ) {
    if (
      this.cssParserService.identify(current) &&
      this.cssParserService.contextOf(current)
    ) {
      this.contextOf(root).css.push(this.extractCssRule(data, current));
      this.contextOf(root).html.push(
        this.lintService.indent(depth, this.extractOpenTag(data, current))
      );
    }

    const content = this.compute(data, current, root, files, depth + 1);
    if (content) {
      this.contextOf(root).html.push(
        this.lintService.indent(depth + 1, content)
      );
    }

    if (this.cssParserService.identify(current)) {
      this.contextOf(root).html.push(
        this.lintService.indent(depth, this.xmlService.closeTag("div"))
      );
    }
  }

  private extractOpenTag(_data: SketchMSData, current: SketchMSLayer) {
    const attributes = [
      `class="${this.cssParserService.contextOf(current).className}"`,
      `role="${current._class}"`,
      `aria-label="${current.name}"`
    ];
    return this.xmlService.openTag("div", attributes);
  }

  private extractCssRule(data: SketchMSData, current: SketchMSLayer) {
    return [
      this.cssParserService.contextOf(current).className + " {",
      this.cssParserService
        .transform(data, current)
        .reduce((acc, file) => acc + file.value, ""),
      "}"
    ].join("\n");
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
          `class="${this.cssParserService.contextOf(current).className}"`,
          `role="${current._class}"`,
          `aria-label="${current.name}"`,
          `src="${buildImageSrc(base64Content, false)}"`
        ];
        return this.xmlService.openTag("img", attributes, { autoclose: true });
      })
      .join("\n");
  }

  private extractAndRegisterSymbolMaster(
    data: SketchMSData,
    current: SketchMSLayer,
    root: SketchMSLayer,
    files: RessourceFile[]
  ) {
    const symbolMaster = data.document.foreignSymbols.find(
      foreignSymbol =>
        foreignSymbol.symbolMaster.symbolID === (current as any).symbolID
    ).symbolMaster;

    this.transform(data, symbolMaster).forEach(file => {
      files.push(file);
      this.contextOf(root).imports.push(current.name);
    });

    return this.xmlService.openTag(current.name, [], {
      autoclose: true
    });
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
}
