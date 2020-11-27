import { Injectable } from '@angular/core';
import { FormatService } from '@xlayers/sketch-lib';
import { WebCodeGenService } from '@xlayers/web-codegen';
import { SketchMSLayer, SketchMSData } from '@xlayers/sketchtypes';

type WebCodeGenOptions = any;

@Injectable({
  providedIn: 'root',
})
export class SvelteAggregatorService {
  constructor(
    private readonly formatService: FormatService,
    private readonly webCodeGenService: WebCodeGenService
  ) {}

  aggregate(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebCodeGenOptions
  ) {
    const fileName = this.formatService.normalizeName(current.name);
    const files = this.webCodeGenService.aggregate(current, data, options);
    const html = files.find((file) => file.language === 'html');
    const css = files.find((file) => file.language === 'css');

    return [
      {
        kind: 'svelte',
        value: this.renderComponent(current, html.value, css.value),
        language: 'html',
        uri: `${options.componentDir}/${fileName}.svelte`,
      },
    ];
  }

  private renderComponent(current: SketchMSLayer, html: string, css: string) {
    return `   
${html}

<style>
  ${css}
</style>`;
  }

  private renderMainScript(current: SketchMSLayer, options: WebCodeGenOptions) {
    const fileName = this.formatService.normalizeName(current.name);

    return `\
import App from "./${options.componentDir + '/' + fileName}.svelte";
    
const app = new App({
  target: document.body
});

    `;
  }
}
