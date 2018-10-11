import { ResizeEvent } from 'angular-resizable-element';
import { getNumberMock } from './sketch.service.mock';

export function getResizeEventMock({
  positive = true,
  top = true,
  bottom = true,
  left = true,
  right = true
}: {
  positive?: boolean;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
} = {}) {
  return {
    rectangle: {
      width: right && getNumberMock(0, 500),
      height: bottom && getNumberMock(0, 500)
    },
    edges: {
      top:  top && (positive ? getNumberMock(0, 500) : getNumberMock(-500, 0)),
      left: left && (positive ? getNumberMock(0, 500) : getNumberMock(-500, 0))
    }
  } as ResizeEvent;
}

export function getFrameMock(x: number, y: number) {
  return {
      x,
      y
  } as SketchMSRect;
}

export function getFlatLayerMock(layer_number: number = 1) {
  return {
    do_objectID: `page-layer`,
    _class: 'page',
    layers: Array.from(Array(layer_number).keys()).map((index) => ({
      do_objectID: `layer-${index}-id`,
      _class: 'page',
      layers: [],
      frame: getFrameMock(getNumberMock(10), getNumberMock(10)),
      name: `layer-${index}`
    })),
    frame: getFrameMock(getNumberMock(10), getNumberMock(10)),
    name: `page-layer`
  } as SketchMSPage;
}
