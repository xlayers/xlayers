import { getFlatLayerMock } from './sketch-layer.component.mock';
import { SketchData } from './sketch.service';

export function getNumberMock(first: number, offset: number = 1) {
  return Math.floor(Math.random() * offset) + first;
}

export function getSketchDataMock() {
  return {
    previews: [{}],
    pages: [
      getFlatLayerMock(getNumberMock(10))
    ]
  } as SketchData;
}
