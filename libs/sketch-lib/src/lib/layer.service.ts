import { Injectable } from '@angular/core';
import FileFormat from '@sketch-hq/sketch-file-format-ts';

type Layers = Exclude<
  FileFormat.AnyLayer,
  | FileFormat.Artboard
  | FileFormat.Group
  | FileFormat.Oval
  | FileFormat.Polygon
  | FileFormat.Rectangle
  | FileFormat.ShapePath
  | FileFormat.Star
  | FileFormat.Triangle
  | FileFormat.ShapeGroup
  | FileFormat.Text
  | FileFormat.SymbolMaster
  | FileFormat.SymbolInstance
  | FileFormat.Slice
  | FileFormat.Hotspot
  | FileFormat.Bitmap
>;

@Injectable({
  providedIn: 'root',
})
export class LayerService {
  identify(current: Layers) {
    return current.layers && Array.isArray(current.layers);
  }

  lookup(current: Layers) {
    return current.layers as any;
  }
}
