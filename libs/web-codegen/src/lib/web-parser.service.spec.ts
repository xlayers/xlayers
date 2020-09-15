import { TestBed } from '@angular/core/testing';
import { WebParserService } from './web-parser.service';
import { loadSketch, SKETCH_PATH, VERSION_LIST } from '@xlayers/test-helpers';
import { readdirSync } from 'fs';

describe('WebParserService', () => {
  let service: WebParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebParserService],
    });

    service = TestBed.inject(WebParserService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
  VERSION_LIST.forEach((version) => {
    const fileNames = readdirSync(`${SKETCH_PATH}/${version}`);

    fileNames.forEach((fileName) => {
      it(`should match ${fileName} snapshot for ${version} on web`, (done) => {
        loadSketch(version, fileName)
          .then((data) => {
            data.pages.forEach((page) => {
              service.compute(page, data, {
                generateClassName: false,
              });
            });

            return data;
          })
          .then((sketch) => {
            expect(sketch).toMatchSnapshot();
            done();
          })
          .catch(done);
      });
    });
  });
});
