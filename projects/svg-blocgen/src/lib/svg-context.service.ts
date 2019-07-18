import { Injectable } from '@angular/core';

export interface SvgBlocGenContextPath {
  type: string;
  attributes: string[];
}

export interface SvgBlocGenContext {
  paths?: SvgBlocGenContextPath[];
  attributes?: string[];
  offset?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SvgContextService {
  identify(current: SketchMSLayer) {
    // TODO: Fix double rendered ShapePath and ShapeGroup
    return ['triangle', 'shapePath', /*"shapeGroup"*/].includes(
      current._class as string
    );
  }

  hasContext(current: SketchMSLayer) {
    return !!this.contextOf(current);
  }

  contextOf(current: SketchMSLayer) {
    return (current as any).svg || (current as any).paths;
  }

  putContext(
    current: SketchMSLayer,
    newContext: SvgBlocGenContext = { paths: [], offset: 0, attributes: [] }
  ) {
    (current as any).svg = {
      ...((current as any).svg || {}),
      ...newContext
    };
  }
}
