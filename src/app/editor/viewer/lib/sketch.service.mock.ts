import { getFlatLayerMock } from './sketch-layer.component.mock';
import { SketchData } from './sketch.service';

export function getIntegerMock(first: number, offset: number = 1) {
  return Math.floor(Math.random() * offset) + first;
}

export function getFloatMock(precision: number = 1) {
  return Number((Number(`${Math.round(Number(`${Math.random()}e${precision}`))}e${-precision}`)).toFixed(precision));
}

export function getSketchDataMock() {
  return {
    previews: [{}],
    pages: [
      getFlatLayerMock(getIntegerMock(10))
    ]
  } as SketchData;
}
