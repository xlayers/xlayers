import { Injectable } from '@angular/core';
import { SvgCodeGenContext } from './svg-codegen';

@Injectable({
  providedIn: 'root'
})
export class SvgContextService {
  identify(current: SketchMSLayer) {
    return ['triangle', 'shapePath'].includes(current._class as string);
  }

  of(current: SketchMSLayer) {
    return (current as any).svg;
  }

  put(current: SketchMSLayer, newContext: SvgCodeGenContext) {
    (current as any).svg = { ...this.of(current), ...newContext };
  }

  clear(current: SketchMSLayer) {
    delete (current as any).svg;
  }
}
