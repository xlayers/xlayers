import { getFlatLayerMock } from '@app/editor/preview/viewer/sketch-layer/sketch-layer.component.mock';

export function getSketchDataMock() {
  return {
    previews: [{}],
    pages: [
      getFlatLayerMock(9)
    ]
  } as SketchMSData;
}
