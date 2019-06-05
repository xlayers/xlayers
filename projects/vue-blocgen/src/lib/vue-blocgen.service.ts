import { Injectable } from "@angular/core";
import { BitmapBlocGenOptions } from "@xlayers/bitmap-blocgen";
import { SvgParserOptions } from "@xlayers/svg-blocgen";
import { CssBlocGenOptions } from "@xlayers/css-blocgen";
import { VueContextService } from "./vue-context.service";
import { VueParserService } from "./vue-parser.service";
import { VueRenderService } from "./vue-render.service";
import { RessourceFile } from '@xlayers/std-blocgen';

export interface VueBlocGenOptions {
  svg?: SvgParserOptions;
  css?: CssBlocGenOptions;
  bitmap?: BitmapBlocGenOptions;
}

@Injectable({
  providedIn: "root"
})
export class VueBlocGenService {
  constructor(
    private readonly vueContextService: VueContextService,
    private readonly vueParserService: VueParserService,
    private readonly vueRenderService: VueRenderService
  ) {}

  transform(
    data: SketchMSData,
    current: SketchMSLayer,
    options?: VueBlocGenOptions
  ) {
    const files: RessourceFile[] = [];

    if (!this.vueContextService.hasContext(current)) {
      this.vueContextService.putContext(current);
      this.vueParserService.compute(data, current, current, files);
      return [
        ...files,
        ...this.vueRenderService.render(data, current, options)
      ];
    }

    return this.vueRenderService.render(data, current, options);
  }
}
