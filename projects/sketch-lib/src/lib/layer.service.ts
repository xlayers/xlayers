import { Injectable } from '@angular/core';
import { SymbolService } from '@xlayers/sketch-lib';

@Injectable({
  providedIn: 'root'
})
export class LayerService {
  identify(current: SketchMSLayer) {
    return current.layers && Array.isArray(current.layers);
  }

  lookup(current: SketchMSLayer, data: SketchMSData) {
    return current.layers as any;
  }
}
