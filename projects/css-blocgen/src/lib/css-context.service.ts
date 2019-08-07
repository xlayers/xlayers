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

  hasContext(current: SketchMSLayer) {
    return !!(current as any).css;
  }

  contextOf(current: SketchMSLayer) {
    return (current as any).css || { rules: {}, className: '' };
  }

  putContext(
    current: SketchMSLayer,
    nextContext: CssBlocGenContext = { rules: {}, className: '' }
  ) {
    (current as any).css = {
      ...this.contextOf(current),
      ...nextContext
    };
  }
}
