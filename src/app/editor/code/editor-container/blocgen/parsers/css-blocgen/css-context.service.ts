import { Injectable } from "@angular/core";

export interface CssBlocGenContext {
  rules: { [key: string]: string };
  className: string;
}

@Injectable({
  providedIn: "root"
})
export class CssContextService {
  identify(current: SketchMSLayer) {
    return ["rect", "page", "rectangle", "group", "symbolMaster"].includes(
      current._class as string
    );
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
        ((current.css as unknown) as CssBlocGenContext).rules || current.css,
      className:
        ((current.css as unknown) as CssBlocGenContext).className ||
        (current as any).css__className
    };
  }

  putContext(
    current: SketchMSLayer,
    context: CssBlocGenContext = { rules: {}, className: "" }
  ) {
    (current as any).css = context;
  }
}
