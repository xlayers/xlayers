import { TestBed, waitForAsync } from '@angular/core/testing';
import { CssCodeGenService } from './css-codegen.service';
import { loadSketch, SKETCH_PATH, VERSION_LIST } from '@xlayers/test-helpers';
import { readdirSync } from 'fs';
import { SketchMSData } from '@xlayers/sketchtypes';

describe('CssCodeGenService', () => {
  let service: CssCodeGenService;
  let sketch: SketchMSData;
  beforeEach(
    waitForAsync(async () => {
      TestBed.configureTestingModule({
        providers: [CssCodeGenService],
      });

      service = TestBed.inject(CssCodeGenService);
      const version = VERSION_LIST[0];
      const fileNames = readdirSync(`${SKETCH_PATH}/${version}`);

      const fileName = fileNames[1];
      const data = await loadSketch(version, fileName);
      data.pages.forEach((page) => {
        service.compute(page, data, {
          generateClassName: false,
        });

        sketch = data;
      });
    })
  );

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should provide the context', () => {
    const data = sketch.pages[0].layers[0];
    expect(service.context(data)).toEqual({
      rules: {
        display: 'block',
        height: '36px',
        left: '0px',
        position: 'absolute',
        top: '0px',
        visibility: 'visible',
        width: '94px',
      },
    });
  });

  it('should provide the context', () => {
    const data = sketch.pages[0].layers[0];
    expect(service.aggregate(data)).toMatchSnapshot();
  });
});
