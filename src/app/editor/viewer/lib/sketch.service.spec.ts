import { SketchService, SketchData } from './sketch.service';
import { TestBed, async } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { getFileMock } from './sketch-container.component.mock';
import { CommonModule } from '@angular/common';
import { getSketchDataMock } from './sketch.service.mock';

const sketchStyleParserService = {
  visit() {}
};

describe('SketchService', () => {
  let sketchService: SketchService;
  let mockFile: File;
  let mockSketchData: SketchData;

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
    mockFile = getFileMock();
    mockSketchData = getSketchDataMock();
  });

  it('should process file', (done: DoneFn) => {
    spyOn(sketchService, 'sketch2Json').and.returnValue(
      Promise.resolve(mockSketchData)
    );
    sketchService.process(mockFile).then(element => {
      expect(element).toBe(mockSketchData);
      done();
    });
  });
});
