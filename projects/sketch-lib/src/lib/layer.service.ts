import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayerService {
  identify(current: SketchMSLayer) {
    return current.layers && Array.isArray(current.layers);
  }

  lookup(current: SketchMSLayer) {
    return current.layers as any;
  }
}
