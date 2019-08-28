import { Injectable } from '@angular/core';
import { ImageService, LayerService, TextService } from '@xlayers/sketch-lib';
import { SvgBlocGenService } from '@xlayers/svg-blocgen';

import { WebBlocGenContext } from './web-blocgen.d';

@Injectable({
  providedIn: 'root'
})
export class WebContextService {
  constructor(
    private readonly layerService: LayerService,
    private textService: TextService,
    private readonly imageService: ImageService,
    private svgBlocGen: SvgBlocGenService
  ) {}

  identify(current: SketchMSLayer) {
    return (
      this.imageService.identify(current) ||
      this.textService.identify(current) ||
      this.layerService.identify(current) ||
      this.svgBlocGen.identify(current) ||
      [
        'oval',
        'rect',
        'rectangle',
        'group',
        'symbolMaster',
        'shapeGroup'
      ].includes(current._class as string)
    );
  }

  of(current: SketchMSLayer) {
    return (current as any).web;
  }

  put(current: SketchMSLayer, nextContext: WebBlocGenContext) {
    (current as any).web = { ...this.of(current), ...nextContext };
  }

  clear(current: SketchMSLayer) {
    delete (current as any).web;
  }
}
