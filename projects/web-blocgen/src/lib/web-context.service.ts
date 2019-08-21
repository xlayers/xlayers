import { Injectable } from '@angular/core';
import { WebBlocGenContext } from './web-blocgen.d';
import { LayerService } from '@xlayers/sketch-lib';

@Injectable({
  providedIn: 'root'
})
export class WebContextService {
  constructor(private layer: LayerService) {}

  identify(current: SketchMSLayer) {
    return [
      'rect',
      'rectangle',
      'group',
      'symbolMaster',
      'shapeGroup'
    ].includes(current._class as string);
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
