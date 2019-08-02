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
      'symbolMaster',
      'oval',
      'text'
    ].includes(current._class as string);
  }

  hasContext(current: SketchMSLayer) {
    return !!this.contextOf(current);
  }

  contextOf(current: SketchMSLayer) {
    return (current as any).css || { rules: {}, className: '' };
  }

  putContext(
    current: SketchMSLayer,
    nextContext: CssBlocGenContext = { rules: {}, className: '' }
  ) {
    (current as any).css = {
      ...((current as any).css || {}),
      ...nextContext
    };
  }
}
