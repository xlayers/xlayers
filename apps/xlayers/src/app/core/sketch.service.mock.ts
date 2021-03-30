import { SketchMSData } from '@xlayers/sketchtypes';
import { getFlatLayerMock } from '../editor/preview/viewer/layer/layer.component.mock';

export function getSketchDataMock() {
  return {
    previews: [{}],
    pages: [getFlatLayerMock(9)],
  } as SketchMSData;
}
