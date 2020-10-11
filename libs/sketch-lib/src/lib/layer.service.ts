import { Injectable } from '@angular/core';
import FileFormat from '@sketch-hq/sketch-file-format-ts';

@Injectable({
  providedIn: 'root',
})
export class LayerService {
  identify(current: FileFormat.SymbolMaster) {
    return current.layers && Array.isArray(current.layers);
  }

  lookup(current: FileFormat.SymbolMaster) {
    return current.layers as any;
  }
}
