import { SketchService } from './sketch.service';
import { TestBed, async } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { getFrameMock } from './sketch-layer.component.mock';
import { NgxsModule } from '@ngxs/store';

describe('SketchService', () => {
  let sketchService: SketchService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, CommonModule, NgxsModule.forRoot([])],
      providers: [
        SketchService
      ]
    });
  }));

  beforeEach(() => {
    sketchService = TestBed.get(SketchService);
  });

  it('should convert sketch to json', (done: DoneFn) => {
    const file = {
      lastModified: new Date('2018-11-21T15:52:43.644Z').valueOf(),
      name: 'mock-file'
    } as File;
    spyOn(sketchService, 'computeImage').and.returnValue({
      width: 20,
      height: 10
    });
    spyOn(sketchService, 'readZipEntries').and.returnValue([{
      relativePath: 'previews/preview.png',
      zipEntry: {
        async() {
          return 'previews-data';
        }
      }
    }, {
      relativePath: 'pages/somepage.json',
      zipEntry: {
        async() {
          return '{"data": "previews-data"}';
        }
      }
    }]);
    sketchService.sketch2Json(file).then(element => {
      expect(element).toEqual({
        pages: [{
          data: 'previews-data'
        }],
        previews: [{
          height: 10,
          width: 20,
          source: 'data:image/png;base64,previews-data'
        }],
        document: {},
        user: {},
        meta: {}
      });
      done();
    });
  });
});
