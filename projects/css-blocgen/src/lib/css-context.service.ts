import { Injectable } from '@angular/core';
import { CssBlocGenContext } from './css-blocgen';

@Injectable({
  providedIn: 'root'
})
export class CssContextService {
  identify(current: SketchMSLayer) {
    return [
      'rect',
      'page',
      'rectangle',
      'group',
      'oval',
      'slice',
      'MSImmutableHotspotLayer',
      'text',
      'triangle',
      'shapePath',
      'shapeGroup'
    ].includes(current._class as string);
  }

  has(current: SketchMSLayer) {
    return !!(current as any).css;
  }

  of(current: SketchMSLayer) {
    return (current as any).css;
  }

  put(current: SketchMSLayer, nextContext: CssBlocGenContext) {
    (current as any).css = {
      ...this.of(current),
      ...nextContext
    };
  }

  clear(current: SketchMSLayer) {
    delete (current as any).web;
  }
}
