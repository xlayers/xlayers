export const componentTemplate = (ast) => {
  return `
  import { Component } from '@stencil/core';

  @Component({
    tag: 'x-layers-component',
    styleUrl: 'x-layers-component.css',
    shadow: true
  })
  export class XLayersComponent {
    render() {
      return ${ast};
    }
  }`;
};

export const testE2ETemplate = () => {
  return `
  import { newE2EPage } from '@stencil/core/testing';

describe('x-layers-component', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<x-layers-component></x-layers-component>');
    const element = await page.find('x-layers-component');
    expect(element).toHaveClass('hydrated');
  });
});`;
};

export const unitTestTemplate = () => {
  return `
  import { newE2EPage } from '@stencil/core/testing';

describe('x-layers-component', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<x-layers-component></x-layers-component>');
    const element = await page.find('x-layers-component');
    expect(element).toHaveClass('hydrated');
  });
});`;
};

export const readmeTemplate = () => {
  const codeBlock = '```';
  return `
## How to use the Xlayers StencilJS Web Components

This implementation export all assets needed to build stenciljs component

Simple use :
${codeBlock}
  // index.html
  <script src="./x-layers-element.js"></script>
  <x-layers-element></x-layers-element>
${codeBlock}

For more examples how to integrate into your application, view [Framework Integrations](https://stenciljs.com/docs/overview)

>  For more information about [Stenciljs](https://stenciljs.com/)
  `;
};
