import { SharedCodegen } from "../shared-codegen.service";
import { XlayersNgxEditorModel } from "../codegen.service";

export const readmeTemplate = (): XlayersNgxEditorModel => ({
  uri: "README.md",
  value: `
## How to use the Xlayers Vuejs module

1. Download and extract the exported module into your workspace,

2. Import the component into your App component or other container.
${SharedCodegen.codeBlock}
<template>
  <div id="app">
    <Xlayers />
  </div>
</template>

<script>
import Xlayers from './xlayers/Xlayers.vue'

export default {
  name: 'app',
  components: {
    Xlayers
  }
}
</script>
${SharedCodegen.codeBlock}

3. Enjoy.
`,
  language: "text/plain",
  kind: "text"
});

export const componentSpecTemplate = (name: string): XlayersNgxEditorModel => {
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  return {
    uri: `${name}.test.vue`,
    value: `
import { shallowMount } from "@vue/test-utils";
import ${capitalizedName} from "@/components/${name}.vue";

describe("${capitalizedName}", () => {
  it("render", () => {
    const wrapper = shallowMount(${capitalizedName}, {});
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
`,
    language: "javascript",
    kind: "vue"
  };
};

export const componentTemplate = (
  name: string,
  html: string,
  css: string
): XlayersNgxEditorModel => {
  return {
    uri: `${name}.ts`,
    value: `
<template>
${html}
</template>

<script>
export default {}
</script>

<style>
${css}
</style>
`,
    language: "html",
    kind: "vue"
  };
};
