import { Injectable } from '@angular/core';
import { SketchMSLayer } from '@xlayers/sketchtypes';

@Injectable({
  providedIn: 'root',
})
export class LayerService {
  identify(current: SketchMSLayer) {
    return current.layers && Array.isArray(current.layers);
  }

  lookup(current: SketchMSLayer) {
    return current.layers as any;
  }
}
