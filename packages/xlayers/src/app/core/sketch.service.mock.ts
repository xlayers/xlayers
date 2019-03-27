import { getFlatLayerMock } from '@app/editor/preview/viewer/layer/layer.component.mock';

export function getSketchDataMock() {
  return {
    previews: [{}],
    pages: [
      getFlatLayerMock(9)
    ]
  } as SketchMSData;
}
