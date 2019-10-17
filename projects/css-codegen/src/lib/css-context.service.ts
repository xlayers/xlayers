import { Injectable } from '@angular/core';
import { CssCodeGenContext } from './css-codegen';

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

  of(current: SketchMSLayer) {
    return (current as any).css;
  }

  put(current: SketchMSLayer, nextContext: CssCodeGenContext) {
    (current as any).css = { ...this.of(current), ...nextContext };
  }

  clear(current: SketchMSLayer) {
    delete (current as any).web;
  }
}
