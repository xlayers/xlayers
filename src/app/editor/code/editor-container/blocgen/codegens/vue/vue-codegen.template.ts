export const readmeTemplate = (name: string) => `\
## How to use the ${name} Vuejs module

1. Download and extract the exported module into your workspace,

2. Import the component into your App component or other container.
\`\`\`
<template>
  <div id="app">
    <${name} />
  </div>
</template>

<script>
import ${name} from './components/${name}.vue'

export default {
  name: 'app',
  components: {
    ${name}
  }
}
</script>
\`\`\`

3. Enjoy.`;

export const componentSpecTemplate = (path: string) => {
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

export const componentTemplate = (html: string, css: string) => `\
<template>
${html}
</template>

<script>
export default {}
</script>

<style>
${css}
</style>
`;

export class VueComponentBuilder {
  private css: string;
  private html: string;

  appendCss(css: string) {
    this.css += "\n" + css;
  }

  appendHtml(html: string) {
    this.html += "\n" + html;
  }

  build() {
    return componentTemplate(this.html, this.css);
  }
}
