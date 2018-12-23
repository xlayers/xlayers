
export const componentTemplate = (ast) => {
  return  `
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
  return  `
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
  return  `
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






