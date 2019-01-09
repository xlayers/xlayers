import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngxs/store';
import { InformUser } from 'src/app/core/state';
import { environment } from 'src/environments/environment';
import { SketchStyleParserService } from './parsers/sketch-style-parser.service';
import { AngularSketchModule } from './sketch.module';

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

  constructor(
    private sanitizer: DomSanitizer,
    private sketchColorParser: SketchStyleParserService,
    private http: HttpClient,
    private store: Store
  ) {
    this._data = {
      pages: [],
      previews: [],
      document: {},
      user: {},
      meta: {}
    } as any;
  }

  async process(file: File) {
    try {
      this._data = await this.sketch2Json(file);
      this.parseColors(this._data.pages);
    } catch (e) {
      this.store.dispatch(
        new InformUser(
          'The design was created using an unsupported version so the result may not be accurate.'
        )
      );
    }
    return this._data;
  }

  parseColors(pages: Array<SketchMSPage>) {
    this.sketchColorParser.visit(pages);
  }

  async readZipEntries(file) {
    return new Promise<any>(resolve => {
      const reader = new FileReader();
      reader.onload = async readerEvent => {
        const data = (readerEvent.target as FileReader).result;
        const zip = await window['JSZip'].loadAsync(data);
        const zips = [];
        zip.forEach((relativePath, zipEntry) => {
          zips.push({ relativePath, zipEntry });
        });
        resolve(zips);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  async computeImage(source) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = _imageLoadEvent => {
        resolve(image);
      };
      image.onerror = _error => {
        reject('Could not load a Sketch preview');
      };
      image.src = source;
    });
  }

  async sketch2Json(file) {
    return new Promise<SketchData>(async (resolve, reject) => {
      const _data: SketchData = {
        pages: [],
        previews: [],
        document: {},
        user: {},
        meta: {}
      } as any;
      const zips = await this.readZipEntries(file);

      await Promise.all(
        zips.map(async ({ relativePath, zipEntry }) => {
          if (relativePath === 'previews/preview.png') {
            const content = await zipEntry.async('base64');
            const source = `data:image/png;base64,${content}`;
            const image = await this.computeImage(source);
            _data.previews.push({
              source,
              width: image.width,
              height: image.height
            });
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
            // @todo deal with SafeResourceUrl!!
            const source = this.sanitizer
              .bypassSecurityTrustResourceUrl(objectUrl)
              .toString();
            const image = await this.computeImage(source);
            _data.previews.push({
              source: objectUrl,
              width: image.width,
              height: image.height
            });
          } else {
            // document.json
            // user.json
            // meta.json
            const content = await zipEntry.async('string');
            _data[relativePath.replace('.json', '')] = JSON.parse(content);
          }
        })
      );

      resolve(_data);
    });
  }

  getPages(): SketchMSPage[] {
    return this._data.pages;
  }

  getDemoFiles() {
    return environment.demoFiles.filter(meta => !meta.disabled).sort((m1, m2) => m2.value - m1.value);
  }

  getSketchDemoFile(filename: string) {
    const repoUrl = `${window.location.origin || environment.baseUrl}/assets/demos/sketchapp/`;
    return this.http.get(`${repoUrl}${filename}.sketch`, {
      responseType: 'blob'
    });
  }
}
