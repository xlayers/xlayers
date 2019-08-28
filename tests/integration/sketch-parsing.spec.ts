import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, TestBed } from "@angular/core/testing";
import { readdirSync, readFile } from "fs";
import * as jszip from "jszip";
import { WebCodeGenService } from "@xlayers/web-codegen";

const VERSION_LIST = [52, 53];
const SKETCH_PATH = "./src/assets/demos/sketchapp";

async function loadSketch(version, fileName) {
  const _data = {
    pages: [],
    previews: [],
    document: {},
    user: {},
    meta: {}
  } as SketchMSData;

  const sketch = await new Promise((resolve, reject) => {
    readFile(`${SKETCH_PATH}/${version}/${fileName}`, (err, file) => {
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
    zips.map(({ relativePath, zipEntry }) => {
      return new Promise(resolve => {
        if (relativePath.startsWith("pages/")) {
          zipEntry.async("string").then(content => {
            _data.pages.push(JSON.parse(content));
            resolve();
          });
        } else if (
          ["meta.json", "document.json", "user.json"].includes(relativePath)
        ) {
          zipEntry.async("string").then(content => {
            _data[relativePath.replace(".json", "")] = JSON.parse(content);
            resolve();
          });
        } else {
          resolve();
        }
      });
    })
  );

  return _data;
}

describe("sketch parser", () => {
  let webCodeGen: WebCodeGenService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [WebCodeGenService],
      declarations: []
    }).compileComponents();
    webCodeGen = TestBed.get(WebCodeGenService);
  }));

  VERSION_LIST.forEach(version => {
    const fileNames = readdirSync(`${SKETCH_PATH}/${version}`);

    fileNames.forEach(fileName => {
      it(`should match ${fileName} snapshot for ${version}`, done => {
        loadSketch(version, fileName)
          .then(data => {
            data.pages.forEach(page => {
              webCodeGen.compute(page, data, {
                generateClassName: false
              });
            });

            return data;
          })
          .then(sketch => {
            expect(sketch).toMatchSnapshot();
            done();
          })
          .catch(done);
      });
    });
  });
});
