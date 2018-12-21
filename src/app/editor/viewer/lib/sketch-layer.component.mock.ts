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
    layers: Array.from(Array(layer_number).keys()).map(index => ({
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
