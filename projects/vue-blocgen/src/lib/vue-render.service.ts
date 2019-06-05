import { Injectable } from "@angular/core";
import { VueBlocGenOptions } from "./vue-blocgen.service";
import { VueContextService, VueBlocGenContext } from "./vue-context.service";
import { SvgRenderService, SvgContextService } from "@xlayers/svg-blocgen/";
import {
  BitmapContextService,
  BitmapRenderService
} from "@xlayers/bitmap-blocgen";

@Injectable({
  providedIn: "root"
})
export class VueRenderService {
  constructor(
    private readonly vueContextService: VueContextService,
    private readonly svgContextService: SvgContextService,
    private readonly bitmapContextService: BitmapContextService,
    private readonly svgRenderService: SvgRenderService,
    private readonly bitmapRenderService: BitmapRenderService
  ) {}

  private assetDir: string;
  private componentDir: string;

  render(
    data: SketchMSData,
    current: SketchMSLayer,
    opts: VueBlocGenOptions = {}
  ) {
    this.assetDir = (opts && opts.assetDir) || "assets";
    this.componentDir = (opts && opts.componentDir) || "components";
    if (this.vueContextService.hasContext(current)) {
      const context = this.vueContextService.contextOf(current);
      return [
        ...this.traverse(data, current).map(file => ({ ...file, kind: "vue" })),
        {
          kind: "vue",
          value: this.formatContext(context),
          language: "html",
          uri: `${this.componentDir}/${current.name}.vue`
        },
        {
          kind: "vue",
          value: this.renderComponentSpec(current.name),
          language: "javascript",
          uri: `${this.componentDir}/${current.name}.spec.js`
        }
      ];
    }

    return [];
  }

  private traverse(data: SketchMSData, current: SketchMSLayer) {
    if (this.vueContextService.identify(current)) {
      return (current.layers as any).flatMap(layer =>
        this.traverse(data, layer)
      );
    }
    return this.retrieveFiles(data, current);
  }

  private retrieveFiles(data: SketchMSData, current: SketchMSLayer) {
    if ((current._class as string) === "symbolInstance") {
      return this.retrieveSymbolMaster(data, current);
    }
    if (this.bitmapContextService.identify(current)) {
      return this.bitmapRenderService.render(data, current).map(file => ({
        ...file,
        uri: [this.assetDir, file.uri].join("/")
      }));
    }
    if (this.svgContextService.identify(current)) {
      return this.svgRenderService.render(data, current).map(file => ({
        ...file,
        uri: [this.assetDir, file.uri].join("/")
      }));
    }
    return [];
  }

  private retrieveSymbolMaster(data: SketchMSData, current: SketchMSLayer) {
    const foreignSymbol = data.document.foreignSymbols.find(
      x => x.symbolMaster.symbolID === (current as any).symbolID
    );

    if (!foreignSymbol) {
      return [];
    }

    return this.render(data, foreignSymbol.symbolMaster);
  }

  private renderComponentSpec(name: string) {
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

    return `\
import { shallowMount } from "@vue/test-utils";
import ${capitalizedName} from "@/${[this.componentDir, name].join("/")}.vue";
import { componentSpecTemplate } from '../codegen/vue/vue.template';
import { SketchMSData } from '../../../../core/sketch.service';

describe("${capitalizedName}", () => {
  it("render", () => {
    const wrapper = shallowMount(${capitalizedName}, {});
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});`;
  }

  private formatContext(context: VueBlocGenContext) {
    return `\
<template>
${context.html.join("\n")}
</template>

<script>
${this.renderScript(context.components)}
</script>

<style>
${context.css.join("\n\n")}
</style>`;
  }

  private renderScript(components: string[]) {
    const imports = components
      .map(
        component =>
          `import ${component} from "${[this.componentDir, component].join(
            "/"
          )}"`
      )
      .join("\n");

    return components.length === 0
      ? `\
export default {}`
      : `\
${imports}

export default {
  components: {
    ${components.join(",\n    ")}
  }
}`;
  }
}
