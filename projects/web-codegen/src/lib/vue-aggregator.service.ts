import { Injectable } from '@angular/core';
import { FormatService } from '@xlayers/sketch-lib';

import { WebCodeGenOptions } from './web-codegen';
import { WebContextService } from './web-context.service';
import { WebAggregatorService } from './web-aggregator.service';

@Injectable({
  providedIn: 'root'
})
export class VueAggregatorService {
  constructor(
    private readonly formatService: FormatService,
    private readonly webContext: WebContextService,
    private readonly webAggretatorService: WebAggregatorService
  ) {}

  aggreate(current: SketchMSLayer, options: WebCodeGenOptions) {
    const fileName = this.formatService.normalizeName(current.name);
    const files = this.webAggretatorService.aggreate(current, options);
    const html = files.find(file => file.language === 'html');
    const css = files.find(file => file.language === 'css');

    return [
      {
        kind: 'vue',
        value: this.renderSpec(current, options),
        language: 'javascript',
        uri: `${options.componentDir}/${fileName}.spec.js`
      },
      {
        kind: 'vue',
        value: this.renderComponent(current, html.value, css.value),
        language: 'html',
        uri: `${options.componentDir}/${fileName}.vue`
      }
    ];
  }

  private renderComponent(current: SketchMSLayer, html: string, css: string) {
    return `\
<template>
${html}
</template>

<script>
${this.renderScript(current)}
</script>

<style>
${css}
</style>`;
  }

  private renderScript(current: SketchMSLayer) {
    const importStatements = this.renderImportStatements(current);
    if (importStatements.length > 0) {
      const importDeclarations = this.generateVueImportDeclaration(current)
        .map(declaration => this.formatService.indent(2, declaration))
        .join('\n');
      return `\
${importStatements}

export default {
  components: {
${importDeclarations}
  }
}`;
    }

    return 'export default {}';
  }

  private renderSpec(current: SketchMSLayer, options: WebCodeGenOptions) {
    const className = this.formatService.className(current.name);
    const fileName = this.formatService.className(current.name);

    return `\
import { shallowMount } from "@vue/test-utils";
import ${className} from "./${options.componentDir}/${fileName}";

describe("${className}", () => {
  it("render", () => {
    const wrapper = shallowMount(${className}, {});
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
];`;
  }

  private renderImportStatements(current: SketchMSLayer) {
    return [
      'import { Component } from \'@stencil/core\';',
      ...this.generateDynamicImport(current)
    ].join('\n');
  }

  private generateDynamicImport(current: SketchMSLayer) {
    const context = this.webContext.of(current);
    return context && context.components
      ? context.components.map(component => {
          const importclassName = this.formatService.className(component);
          const importFileName = this.formatService.normalizeName(component);
          return `import { ${importclassName} } from "./${importFileName}"; `;
        })
      : [];
  }

  private generateVueImportDeclaration(current: SketchMSLayer) {
    const context = this.webContext.of(current);
    return context && context.components
      ? context.components.map(component =>
          this.formatService.className(component)
        )
      : [];
  }
}
