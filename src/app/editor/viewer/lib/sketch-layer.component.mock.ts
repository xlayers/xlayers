import { ResizeEvent } from 'angular-resizable-element';
import { getIntegerMock } from './sketch.service.mock';

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
      width: right && getIntegerMock(0, 500),
      height: bottom && getIntegerMock(0, 500)
    },
    edges: {
      top:  top && (positive ? getIntegerMock(0, 500) : getIntegerMock(-500, 0)),
      left: left && (positive ? getIntegerMock(0, 500) : getIntegerMock(-500, 0))
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
      frame: getFrameMock(getIntegerMock(10), getIntegerMock(10)),
      name: `layer-${index}`
    })),
    frame: getFrameMock(getIntegerMock(10), getIntegerMock(10)),
    name: `page-layer`
  } as SketchMSPage;
}
