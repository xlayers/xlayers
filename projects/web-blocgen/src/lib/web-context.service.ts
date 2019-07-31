import { Injectable } from '@angular/core';
import { WebBlocGenContext } from './web-blocgen.d';

@Injectable({
  providedIn: 'root'
})
export class WebContextService {
  identify(current: SketchMSLayer) {
    return (
      current.layers &&
      Array.isArray(current.layers) &&
      ['rect', 'page', 'rectangle', 'group', 'symbolMaster'].includes(
        current._class as string
      )
    );
  }

  hasContext(current: SketchMSLayer) {
    return !!(current as any).vue;
  }

  contextOf(current: SketchMSLayer) {
    return (current as any).vue;
  }

  putContext(
    current: SketchMSLayer,
    nextContext: WebBlocGenContext = { html: [], css: [], components: [] }
  ) {
    (current as any).vue = {
      ...((current as any).vue || {}),
      ...nextContext
    };
  }
}
