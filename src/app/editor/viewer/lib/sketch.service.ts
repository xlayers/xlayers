import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SketchStyleParserService } from './parsers/sketch-style-parser.service';
import { environment } from 'src/environments/environment';

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

  public demoFiles = [
    'md-components-notifications-heads-up',
    'md-components-cards-welcome-back',
    'md-components-keyboards',
    'md-components-tabs-status-bar',
    'md-components-cards-safari',
    'md-components-date-picker',
    'md-components-chips-open-chip',
    'md-components-cards-homes',
    'md-components-buttons-lights',
    'md-components-cards-pooch',
    'md-components-buttons-fabs-light'
  ];

  constructor(private sanitizer: DomSanitizer, private sketchColorParser: SketchStyleParserService, private http: HttpClient) {
    this._data = {
      pages: [],
      previews: [],
      document: {},
      user: {},
      meta: {}
    } as any;
  }

  async process(file: File) {
    this._data = await this.sktech2Json(file);
    this.parseColors(this._data.pages);
    return this._data;
  }

  parseColors(pages: Array<SketchMSPage>) {
    this.sketchColorParser.visit(pages);
  }

  async sktech2Json(file) {
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

  getDemoFiles() {
    return this.demoFiles;
  }

  getSketchDemoFile(filename: string) {
    const repoUrl = `${environment.baseUrl}/assets/demos/sketchapp/`;
    return this.http.get(`${repoUrl}${filename}.sketch`, { responseType: 'blob' });
  }
}
