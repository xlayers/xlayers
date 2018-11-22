import { SketchService } from './sketch.service';
import { TestBed, async } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { getFrameMock } from './sketch-layer.component.mock';

describe('SketchService', () => {
  let sketchService: SketchService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, CommonModule],
      providers: [
        SketchService
      ]
    });
  }));

  beforeEach(() => {
    sketchService = TestBed.get(SketchService);
  });

  it('should process file', (done: DoneFn) => {
    const file = {
      lastModified: new Date('2018-11-21T15:52:43.644Z').valueOf(),
      name: 'mock-file'
    } as File;
    const data = {
      previews: [{}],
      pages: [
        {
          do_objectID: `page-layer`,
          _class: 'page',
          layers: [{
            do_objectID: `layer-0-id`,
            _class: 'layer',
            layers: [],
            frame: getFrameMock(982, 240),
            name: `layer-0`
          }],
          frame: getFrameMock(824, 918),
          name: `page-layer`
        }
      ]
    } as SketchData;
    spyOn(sketchService, 'sketch2Json').and.returnValue(
      Promise.resolve(data)
    );
    sketchService.process(file).then(element => {
      expect(element).toBe(data);
      done();
    });
  });
});
