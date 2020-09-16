import { getFlatLayerMock } from '../editor/preview/viewer/layer/layer.component.mock';
import { SketchMSData } from '@xlayers/sketchtypes';

export function getSketchDataMock() {
  return {
    previews: [{}],
    pages: [getFlatLayerMock(9)],
  } as SketchMSData;
}
