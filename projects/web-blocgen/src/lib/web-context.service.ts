import { Injectable } from '@angular/core';
import { WebBlocGenContext } from './web-blocgen.d';

@Injectable({
  providedIn: 'root'
})
export class WebContextService {
  identify(current: SketchMSLayer) {
    return ['rect', 'page', 'rectangle', 'group', 'symbolMaster'].includes(
      current._class as string
    );
  }

  hasContext(current: SketchMSLayer) {
    return !!(current as any).web;
  }

  contextOf(current: SketchMSLayer) {
    return (current as any).web || { html: [], css: [], components: [] };
  }

  putContext(
    current: SketchMSLayer,
    nextContext: WebBlocGenContext = { html: [], css: [], components: [] }
  ) {
    (current as any).web = {
      ...((current as any).web || {}),
      ...nextContext
    };
  }
}
