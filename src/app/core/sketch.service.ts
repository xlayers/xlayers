import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InformUser, UiState, CurrentFile } from '@app/core/state';
import { environment } from '@env/environment';
import { Store } from '@ngxs/store';
import {
  SketchStyleParserService,
  SupportScore
} from '@xlayers/sketchapp-parser';

export interface SketchMSData {
  pages: SketchMSPage[];
  previews: SketchMSPreview[];
  document: SketchMSDocumentData;
  user: SketchMSUserData;
  meta: SketchMSMetadata;
  resources?: {
    images: {
      [id: string]: ResourceImageData;
    };
  };
}

export interface ResourceImageData {
  source: string;
  image: HTMLImageElement;
}

@Injectable({
  providedIn: 'root'
})
export class SketchService {
  _data: SketchMSData;

  constructor(
    private sketchStyleParser: SketchStyleParserService,
    private http: HttpClient,
    private store: Store
  ) {
    this.store.select(UiState.currentFile).subscribe(currentFile => {
      this._data = currentFile as SketchMSData;
    });
  }

  async process(file: File) {
    const data = await this.sketch2Json(file) as SketchMSData;

    if (this.sketchStyleParser.visit(data as SketchMSData) === SupportScore.LEGACY) {
      this.store.dispatch(
        new InformUser(
          'The design was created using a legacy version of SketchApp, so the result may not be accurate.'
        )
      );
    }
    return data;
  }

  async readZipEntries(file: Blob) {
    return new Promise<any[]>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = readerEvent => {
        const data = (readerEvent.target as FileReader).result;
        window['JSZip']
          .loadAsync(data)
          .then((zip: any[]) => {
            const zips = [];
            zip.forEach((relativePath: string, zipEntry) => {
              zips.push({ relativePath, zipEntry });
            });
            resolve(zips);
          })
          .catch((e: Error) => {
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

  async computeImage(source: string, filepath: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = _imageLoadEvent => {
        resolve(image);
      };
      image.onerror = _error => {
        reject(`Could not load a Sketch preview "${filepath}"`);
      };
      image.src = source;
    });
  }

  private async buildImage(
    content: string,
    relativePath: string
  ): Promise<ResourceImageData> {
    const source = `data:image/png;base64,${content}`;
    return {
      source,
      image: await this.computeImage(source, relativePath)
    };
  }

  async sketch2Json(file: Blob) {
    const _data: SketchMSData = {
      pages: [],
      previews: [],
      document: {} as any,
      user: {},
      meta: {} as any,
      resources: {
        images: {}
      }
    };

    const zips = await this.readZipEntries(file);

    await Promise.all(
      zips.map(async ({ relativePath, zipEntry }) => {
        if (
          relativePath === 'previews/preview.png' ||
          relativePath.startsWith('images/')
        ) {
          const content = await zipEntry.async('base64');
          const imageData = await this.buildImage(content, relativePath);

          if (relativePath === 'previews/preview.png') {
            // this is a preview, so add it to the previews array
            _data.previews.push({
              source: imageData.source,
              width: imageData.image.width,
              height: imageData.image.height
            });
          } else {
            // this is a resource image, add it to the resource factory
            _data.resources.images[relativePath] = imageData;
          }
        } else if (relativePath.startsWith('pages/')) {
          const content = await zipEntry.async('string');

          try {
            const page = JSON.parse(content) as SketchMSPage;
            _data.pages.push(page);
          } catch (e) {
            throw new Error(`Could not load page "${relativePath}"`);
          }
        } else if (relativePath.endsWith('.pdf')) {
          // text-previews/text-previews.pdf
          // removed because of: https://github.com/xlayers/xlayers/issues/200
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
    return environment.demoFiles
      .filter(meta => !meta.disabled)
      .sort((m1, m2) => m2.value - m1.value);
  }

  getSketchDemoFile(filename: string) {
    const repoUrl = `${window.location.origin ||
      environment.baseUrl}/assets/demos/sketchapp/`;
    return this.http.get(`${repoUrl}${filename}.sketch`, {
      responseType: 'blob'
    });
  }

  getImageDataFromRef(ref: string) {
    return this._data.resources.images[ref];
  }
}
