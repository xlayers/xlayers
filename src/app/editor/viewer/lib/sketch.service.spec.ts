import { SketchService, SketchData } from './sketch.service';
import { TestBed, async } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { getFileMock } from './sketch-container.component.mock';
import { SketchStyleParserService } from './parsers/sketch-style-parser.service';
import { CommonModule } from '@angular/common';
import { getSketchDataMock } from './sketch.service.mock';

describe('SketchService', () => {
  let sketchService: SketchService;
  let sketchColorParser: SketchStyleParserService;
  let mockFile: File;
  let mockSketchData: SketchData;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, CommonModule],
      providers: [SketchService, SketchStyleParserService]
    });
  }));

  beforeEach(() => {
    sketchService = TestBed.get(SketchService);
    sketchColorParser = TestBed.get(SketchStyleParserService);
    mockFile = getFileMock();
    mockSketchData = getSketchDataMock();
  });

  it('should process file', (done: DoneFn) => {
    spyOn(sketchService, 'sktech2Json').and.returnValue(Promise.resolve(mockSketchData));
    spyOn(sketchColorParser, 'visit').and.returnValue(null);
    sketchService.process(mockFile).then((element) => {
      expect(element).toBe(mockSketchData);
      done();
    });
  });
});
