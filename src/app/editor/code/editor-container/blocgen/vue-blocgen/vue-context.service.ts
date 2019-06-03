import { Injectable } from "@angular/core";

export interface VueBlocGenContext {
  html: string[];
  css: string[];
  components: string[];
}

@Injectable({
  providedIn: "root"
})
export class VueContextService {
  identify(current: SketchMSLayer) {
    return (
      current.layers &&
      Array.isArray(current.layers) &&
      ["rect", "page", "rectangle", "group", "symbolMaster"].includes(
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
    newContext: VueBlocGenContext = { html: [], css: [], components: [] }
  ) {
    (current as any).vue = newContext;
  }
}
