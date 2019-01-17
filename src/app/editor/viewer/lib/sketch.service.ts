import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngxs/store';
import { InformUser } from 'src/app/core/state';
import { environment } from 'src/environments/environment';
import { SketchStyleParserService, SupportScore } from './parsers/sketch-style-parser.service';
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
    private sketchStyleParser: SketchStyleParserService,
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
    this._data = await this.sketch2Json(file);
    if (this.sketchStyleParser.visit(this._data) === SupportScore.LEGACY) {
      this.store.dispatch(
        new InformUser(
          'The design was created using a legacy version of SketchApp, so the result may not be accurate.'
        )
      );
    }
    return this._data;
  }

  async readZipEntries(file) {
    return new Promise<any[]>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = readerEvent => {
        const data = (readerEvent.target as FileReader).result;
        window['JSZip']
          .loadAsync(data)
          .then(zip => {
            const zips = [];
            zip.forEach((relativePath, zipEntry) => {
              zips.push({ relativePath, zipEntry });
            });
            resolve(zips);
          })
          .catch(e => {
            reject(e);
          });
      };
      reader.onerror = e => {
        reject(e);
      };
      try {
        reader.readAsArrayBuffer(file);
      } catch (error) {
        reject(error);
      }
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
            throw new Error('Could not load page');
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

    return _data;
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
