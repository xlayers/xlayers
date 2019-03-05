import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { SketchService } from './sketch.service';

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

  it('should convert sketch to json', async(() => {
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
    }, {
      relativePath: 'images/somepage.png',
      zipEntry: {
        async() {
          return 'image-data';
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
        meta: {},
        resources: {
          images: {
            'images/somepage.png': {
              source: 'data:image/png;base64,image-data',
              image: {
                width: 20,
                height: 10
              }
            }
          }
        }
      });
    });
  }));
});
