import { Injectable } from '@angular/core';
import { WebBlocGenContext } from './web-blocgen.d';
import { LayerService, TextService, ImageService } from '@xlayers/sketch-lib';
import { SvgBlocGenService } from '@xlayers/svg-blocgen';

@Injectable({
  providedIn: 'root'
})
export class WebContextService {
  constructor(
    private layer: LayerService,
    private text: TextService,
    private image: ImageService,
    private svgBlocGen: SvgBlocGenService
  ) {}

  identify(current: SketchMSLayer) {
    return (
      this.image.identify(current) ||
      this.text.identify(current) ||
      this.layer.identify(current) ||
      this.svgBlocGen.identify(current) ||
      ['rect', 'rectangle', 'group', 'symbolMaster', 'shapeGroup'].includes(
        current._class as string
      )
    );
  }

  has(current: SketchMSLayer) {
    return !!(current as any).web;
  }

  of(current: SketchMSLayer) {
    return (current as any).web || { html: '', components: [] };
  }

  put(
    current: SketchMSLayer,
    nextContext: WebBlocGenContext = { html: '', components: [] }
  ) {
    (current as any).web = {
      ...this.of(current),
      ...nextContext
    };
  }

  clear(current: SketchMSLayer) {
    delete (current as any).web;
  }
}
