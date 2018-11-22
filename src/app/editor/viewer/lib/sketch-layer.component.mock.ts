import { ResizeEvent } from 'angular-resizable-element';

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
      width: right && 38,
      height: bottom && 98
    },
    edges: {
      top:  top && (positive ? 917 : -67),
      left: left && (positive ? 578 : -346)
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
      _class: 'layer',
      layers: [],
      frame: getFrameMock(index, index),
      name: `layer-${index}`
    })),
    frame: getFrameMock(824, 918),
    name: `page-layer`
  } as SketchMSPage;
}
