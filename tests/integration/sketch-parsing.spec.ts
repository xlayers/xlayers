import { readFile, writeFile, readdir, access, constants, readdirSync } from 'fs';
import * as jszip from 'jszip';
import { SketchStyleParserService } from '@xlayers/sketchapp-parser';
import { async,  TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { UiState } from '@app/core/state';
import { CodeGenState } from '@app/core/state/page.state';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SketchContainerComponent } from '@app/editor/viewer/lib/sketch-container.component';
import { SketchData } from '@app/editor/viewer/lib/sketch.service';

const VERSION_LIST = [50, 51, 52];

function loadSnapshot(version, fileName) {
  return new Promise((resolve, reject) => {
    readFile(`./tests/snapshots/${version}/${fileName}.json`, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

function saveSnapshot(version, fileName, data) {
  return new Promise((resolve, reject) => {
    writeFile(`./tests/snapshots/${version}/${fileName}.json`, JSON.stringify(data), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function loadSketch(version, fileName) {
  const _data = {
    pages: [],
    previews: [],
    document: {},
    user: {},
    meta: {}
  } as SketchData;

  const sketch = await new Promise((resolve, reject) => {
    readFile(`./packages/xlayers/src/assets/demos/sketchapp/${version}/${fileName}`, (err, file) => {
      if (err) {
        reject(err);
      } else {
        resolve(file);
      }
    });
  });

  const zip = await jszip.loadAsync(sketch);

  const zips = [];
  zip.forEach((relativePath, zipEntry) => {
    zips.push({ relativePath, zipEntry });
  });

  await Promise.all(
    zips.map(({ relativePath, zipEntry }) =>
      zipEntry.async('string')
      .then((content) => new Promise((resolve) => {
        if (relativePath.startsWith('pages/')) {
          const page = JSON.parse(content) as SketchMSPage;
          _data.pages.push(page);
        } else if (relativePath !== 'previews/preview.png' && !relativePath.startsWith('images/')) {
          _data[relativePath.replace('.json', '')] = JSON.parse(content);
        }
        resolve();
      }))
    )
  );

  return _data;
}

describe('sketch parser', () => {
  let sketchStyleParserService: SketchStyleParserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        NgxsModule.forRoot([UiState, CodeGenState]),
        MatSnackBarModule,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      providers: [SketchStyleParserService],
      declarations: [SketchContainerComponent]
    }).compileComponents();
    sketchStyleParserService = TestBed.get(SketchStyleParserService);
  }));

  beforeAll(async(() => {
    VERSION_LIST.forEach(async (version) => {
      const fileNames = await new Promise((resolve, reject) => {
        readdir(`./packages/xlayers/src/assets/demos/sketchapp/${version}`, (err, dirfileNames) => {
          if (err) {
            reject();
          } else {
            resolve(dirfileNames);
          }
        });
      });

      await Promise.all((fileNames as Array<string>).map((fileName) =>
        new Promise((resolve, reject) => {
          access(`./tests/snapshots/${version}/${fileName}.json`, constants.R_OK, (err) => {
            if (err) {
              loadSketch(version, fileName)
              .then(((data) => {
                sketchStyleParserService.visit(data);
                saveSnapshot(version, fileName, data)
                .then(() => {
                  resolve();
                })
                .catch(reject);
              }));
            } else {
              resolve();
            }
          });
        }))
      );
    });
  }));

  VERSION_LIST.forEach((version) => {
      const fileNames = readdirSync(`./packages/xlayers/src/assets/demos/sketchapp/${version}`);

      fileNames.forEach((fileName) => {
        it(`should match ${fileName} snapshot for ${version}`, (done: DoneFn) => {
          Promise.all([
            loadSnapshot(version, fileName),
            loadSketch(version, fileName)
            .then((data) => {
              sketchStyleParserService.visit(data);
              return data;
            })
          ])
          .then(([snapshot, sketch]) => {
            expect(sketch).toEqual(snapshot);
            done();
          })
          .catch(done);
        });
    });
  });
});
