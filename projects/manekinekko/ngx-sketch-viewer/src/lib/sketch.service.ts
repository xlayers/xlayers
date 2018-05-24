import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

export interface SketchUser {
  [key: string]: {
    // "{-1185.8387361675846, 178}"
    scrollOrigin: string;
    zoomValue: number;
  };
}

export interface SketchData {
  pages: Array<SketchMSPage>;
  previews: Array<{ source: string; width: number; height: number }>;
  document: SketchMSDocumentData;
  user: {};
  meta: SketchMSMetadata;
}

@Injectable({
  providedIn: 'root'
})
export class SketchService {
  _data: SketchData;
  constructor(private sanitizer: DomSanitizer) {
    this._data = {
      pages: [],
      previews: [],
      document: {},
      user: {},
      meta: {}
    } as any;
  }

  async process(file: File) {
    this._data = await this.parse(file);
    return this._data;
  }

  async parse(file) {
    return new Promise<SketchData>((resolve, reject) => {
      const _data: SketchData = {
        pages: [],
        previews: [],
        document: {},
        user: {},
        meta: {}
      } as any;
      const reader = new FileReader();
      reader.onload = async readerEvent => {
        const data = (readerEvent.target as FileReader).result;

        const zip = await window['JSZip'].loadAsync(data);

        zip.forEach(async (relativePath, zipEntry) => {
          if (relativePath === 'previews/preview.png') {
            const content = await zipEntry.async('base64');
            const source = `data:image/png;base64,${content}`;

            // compute the image preview size
            const image = new Image();
            image.onload = imageLoadEvent => {
              _data.previews.push({
                source,
                width: image.width,
                height: image.height
              });
            };
            image.onerror = error => {
              reject('Could not load a Sketch preview');
            };
            image.src = source;
          } else if (relativePath.startsWith('pages/')) {
            const content = await zipEntry.async('string');

            try {
              const page = JSON.parse(content) as SketchMSPage;
              page.id = page.objectID;
              _data.pages.push(page);
            } catch (e) {
              reject('Could not load page');
            }
          } else if (relativePath.startsWith('images/')) {
            const blob = await zipEntry.async('blob');
            const objectUrl = URL.createObjectURL(blob);

            // compute the image preview size
            const image = new Image();
            image.onload = imageLoadEvent => {
              _data.previews.push({
                source: objectUrl,
                width: image.width,
                height: image.height
              });
            };
            image.onerror = error => {
              reject('Could not load a Sketch preview');
            };

            // @todo deal with SafeResourceUrl!!
            image.src = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl).toString();
          } else {
            // document.json
            // user.json
            // meta.json
            const content = await zipEntry.async('string');
            const json = JSON.parse(content);
            _data[relativePath.replace('.json', '')] = json;
          }
        });

        // reschedule the resolve. Other the promise will be
        // resolved too early.
        setTimeout(_ => resolve(_data), 0);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  getPages(): SketchMSPage[] {
    return this._data.pages;
  }
}
