import { Injectable } from '@angular/core';
import { FormatService } from '@xlayers/sketch-lib';
import { WebContextService } from './web-context.service';
import { WebBlocGenOptions } from './web-blocgen';
import { WebRenderService } from './web-render.service';

@Injectable({
  providedIn: 'root'
})
export class VueRenderService {
  constructor(
    private format: FormatService,
    private webContext: WebContextService,
    private webRender: WebRenderService
  ) {}

  render(current: SketchMSLayer, options: WebBlocGenOptions) {
    const fileName = this.format.normalizeName(current.name);
    const context = this.webContext.of(current);
    const files = this.webRender.render(current, options);
    const html = files.find(file => file.language === 'html');
    const css = files.find(file => file.language === 'css');

    return [
      {
        kind: 'vue',
        value: this.renderSpec(name, options),
        language: 'javascript',
        uri: `${options.componentDir}/${fileName}.spec.js`
      },
      {
        kind: 'vue',
        value: this.renderComponent(
          html.value,
          css.value,
          context.components || [],
          options
        ),
        language: 'html',
        uri: `${options.componentDir}/${fileName}.vue`
      }
    ];
  }

  private renderComponent(
    html: string,
    css: string,
    components: string[],
    options: WebBlocGenOptions
  ) {
    return `\
<template>
${html}
</template>

<script>
${this.renderScript(components, options)}
</script>

<style>
${css}
</style>`;
  }

  private renderScript(components: string[], options: WebBlocGenOptions) {
    const importStatements = components.map(component => {
      const className = this.format.className(component);
      const importFileName = this.format.normalizeName(component);
      return `import { ${className} } from "./${importFileName}";`;
    });
    const moduleNames = components.map(className =>
      this.format.className(className)
    );

    if (components.length > 0) {
      return `\
${importStatements.join('\n')}

export default {
  components: {
${this.format.indentFile(2, moduleNames.join('\n')).join('\n')}
  }
}`;
    }

    return 'export default {}';
  }

  private renderSpec(name: string, options: WebBlocGenOptions) {
    const className = this.format.className(name);
    const fileName = this.format.className(name);

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
}
