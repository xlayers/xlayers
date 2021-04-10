import { SketchMSData } from '@xlayers/sketchtypes';
import { readFile } from 'fs';
import * as jszip from 'jszip';
import * as path from 'path';

export const VERSION_LIST = [52, 53, 59];
export const SKETCH_PATH = path.join(
  __dirname,
  '../../../../',
  './apps/xlayers/src/assets/demos/sketchapp'
);

export async function loadSketch(version, fileName) {
  const _data = {
    pages: [],
    previews: [],
    document: {},
    user: {},
    meta: {},
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

  const zip = await jszip.loadAsync(sketch as any);

  const zips = [];
  zip.forEach((relativePath, zipEntry) => {
    zips.push({ relativePath, zipEntry });
  });

  await Promise.all(
    zips.map(
      ({ relativePath, zipEntry }) =>
        new Promise((resolve) => {
          if (relativePath.startsWith('pages/')) {
            zipEntry.async('string').then((content) => {
              _data.pages.push(JSON.parse(content));
              resolve();
            });
          } else if (
            ['meta.json', 'document.json', 'user.json'].includes(relativePath)
          ) {
            zipEntry.async('string').then((content) => {
              _data[relativePath.replace('.json', '')] = JSON.parse(content);
              resolve();
            });
          } else {
            resolve();
          }
        })
    )
  );

  return _data;
}
