import { Injectable } from '@angular/core';

export interface SketchContent {
  pages: any[];
  previews: any[];
}

@Injectable({
  providedIn: 'root'
})
export class SketchService {
  constructor() {}

  async process(file: File) {
    const json = await this.parse(file);
    console.log(json);

    return json;
  }

  async parse(file) {
    const output: SketchContent = {
      pages: [],
      previews: []
    };
    const reader = new FileReader();
    reader.onload = async e => {
      const data = (e.target as FileReader).result;

      const zip = await window['JSZip'].loadAsync(data);
      zip.forEach(async (relativePath, zipEntry) => {
        if (relativePath === 'previews/preview.png') {
          const content = await zipEntry.async('base64');

          try {
            output.previews.push(`data:image/png;base64,${content}`);
          } catch (e) {
            throw new Error('Could not load a Sketch preview');
          }
        } else if (relativePath.startsWith('pages/')) {
          const content = await zipEntry.async('string');

          try {
            const page = JSON.parse(content);
            output.pages.push(page);
          } catch (e) {
            throw new Error('Could not load page');
          }
        }
      });
    };
    reader.readAsArrayBuffer(file);

    return output;
  }
}
