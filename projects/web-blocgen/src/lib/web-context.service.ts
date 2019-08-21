import { Injectable } from '@angular/core';
import { WebBlocGenContext } from './web-blocgen.d';

@Injectable({
  providedIn: 'root'
})
export class WebContextService {
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
    (current as any).web = null;
  }
}
