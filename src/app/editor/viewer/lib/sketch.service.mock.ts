import { getFlatLayerMock } from './sketch-layer.component.mock';
import { SketchData } from './sketch.service';

export function getIntegerMock(first: number, offset: number = 1) {
  return Math.floor(getFloatMock(first, offset));
}

export function getFloatMock(first: number = 0, offset: number = 1, precision: number = 1) {
  const min = Math.ceil(first);
  const max = Math.floor(offset);
  const number = Math.random() * (max - min) + min;
  return Number((Number(`${Math.round(Number(`${number}e${precision}`))}e${-precision}`)).toFixed(precision));
}

export function getSketchDataMock() {
  return {
    previews: [{}],
    pages: [
      getFlatLayerMock(getIntegerMock(1, 10))
    ]
  } as SketchData;
}
