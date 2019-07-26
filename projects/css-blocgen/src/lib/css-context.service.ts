import { Injectable } from '@angular/core';

export interface CssBlocGenContext {
  rules: { [key: string]: string };
}

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
    if (!current.css) {
      return undefined;
    }

    return {
      rules:
        ((current.css as unknown) as CssBlocGenContext).rules || current.css
    };
  }

  putContext(
    current: SketchMSLayer,
    nextContext: CssBlocGenContext = { rules: {} }
  ) {
    (current as any).css = {
      ...((current as any).css || {}),
      ...nextContext
    };
  }
}
