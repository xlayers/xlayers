import { getFlatLayerMock } from './sketch-layer.component.mock';
import { SketchData } from './sketch.service';

export function getSketchDataMock() {
  return {
    previews: [{}],
    pages: [
      getFlatLayerMock(9)
    ]
  } as SketchData;
}
