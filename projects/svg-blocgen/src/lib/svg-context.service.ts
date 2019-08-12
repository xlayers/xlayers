import { Injectable } from '@angular/core';
import { SvgBlocGenContext } from './svg-blocgen';

@Injectable({
  providedIn: 'root'
})
export class SvgContextService {
  identify(current: SketchMSLayer) {
    // TODO: Fix double rendered ShapePath and ShapeGroup
    return ['triangle', 'shapePath' /*"shapeGroup"*/].includes(
      current._class as string
    );
  }

  hasContext(current: SketchMSLayer) {
    return !!(current as any).svg;
  }

  contextOf(current: SketchMSLayer) {
    return (current as any).svg || { paths: [], offset: 0, attributes: [] };
  }

  putContext(
    current: SketchMSLayer,
    newContext: SvgBlocGenContext = { paths: [], offset: 0, attributes: [] }
  ) {
    (current as any).svg = {
      ...this.contextOf(current),
      ...newContext
    };
  }
}
