import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { loadSketch, SKETCH_PATH, VERSION_LIST } from '@xlayers/test-helpers';
import { WebCodeGenService } from '@xlayers/web-codegen';
import { readdirSync } from 'fs';

describe('sketch parser', () => {
  let webCodeGen: WebCodeGenService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        providers: [WebCodeGenService],
        declarations: [],
      }).compileComponents();
      webCodeGen = TestBed.inject(WebCodeGenService);
    })
  );

  VERSION_LIST.forEach((version) => {
    const fileNames = readdirSync(`${SKETCH_PATH}/${version}`);

    fileNames.forEach((fileName) => {
      it(`should match ${fileName} snapshot for ${version}`, (done) => {
        loadSketch(version, fileName)
          .then((data) => {
            data.pages.forEach((page) => {
              webCodeGen.compute(page, data, {
                generateClassName: false,
              });
            });

            return data;
          })
          .then((sketch) => {
            expect(sketch).value('');
            done();
          })
          .catch(done);
      });
    });
  });
});
