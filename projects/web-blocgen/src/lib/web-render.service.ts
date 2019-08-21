import { Injectable } from '@angular/core';
import { FormatService } from '@xlayers/sketch-lib';
import { WebContextService } from './web-context.service';
import { WebBlocGenOptions } from './web-blocgen';
import { CssBlocGenService } from '@xlayers/css-blocgen';

@Injectable({
  providedIn: 'root'
})
export class WebRenderService {
  constructor(
    private format: FormatService,
    private webContext: WebContextService,
    private cssBlocGen: CssBlocGenService
  ) {}

  render(current: SketchMSLayer, options: WebBlocGenOptions) {
    const fileName = this.format.normalizeName(current.name);
    const context = this.webContext.of(current);

    return [
      {
        kind: 'web',
        value: context.html,
        language: 'html',
        uri: `${options.componentDir}/${fileName}.html`
      },
      ...this.cssBlocGen.render(current, options).map(file => ({
        ...file,
        kind: 'web'
      }))
    ];
  }
}
