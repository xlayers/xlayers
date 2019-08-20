import { Injectable } from '@angular/core';
import { WebBlocGenContext } from './web-blocgen.d';

@Injectable({
  providedIn: 'root'
})
export class WebContextService {
  identify(current: SketchMSLayer) {
    return ['rect', 'rectangle', 'group', 'symbolMaster'].includes(
      current._class as string
    );
  }

  hasContext(current: SketchMSLayer) {
    return !!(current as any).web;
  }

  contextOf(current: SketchMSLayer) {
    return (current as any).web || { html: '', components: [] };
  }

  putContext(
    current: SketchMSLayer,
    nextContext: WebBlocGenContext = { html: '', components: [] }
  ) {
    (current as any).web = {
      ...this.contextOf(current),
      ...nextContext
    };
  }
}
