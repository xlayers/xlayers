import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { CssBlocGenService } from '@xlayers/css-blocgen';
import { SketchIngestorService } from '@xlayers/sketch-ingestor';
import { SvgBlocGenService } from '@xlayers/svg-blocgen';
import { TextBlocGenService } from '@xlayers/text-blocgen';

export interface SketchMSData {
  pages: SketchMSPage[];
  previews: SketchMSPreview[];
  document: SketchMSDocumentData;
  user: SketchMSUserData;
  meta: SketchMSMetadata;
}

@Injectable({
  providedIn: 'root'
})
export class SketchService {
  constructor(
    private sketchIngestorService: SketchIngestorService,
    private http: HttpClient,
    private cssBlocGenService: CssBlocGenService,
    private textBlocGenService: TextBlocGenService,
    private svgBlocGenService: SvgBlocGenService
  ) {}

  async process(file: File) {
    const data = await this.sketchIngestorService.process(file);
    (data.pages as any).forEach(page => this.traverse(data, page));
    return data;
  }

  private traverse(data: SketchMSData, current: SketchMSLayer) {
    if (Array.isArray(current.layers)) {
      current.layers.forEach(layer => {
        this.cssBlocGenService.compute(layer);
        this.traverse(data, layer);
      });
    } else {
      if ((current._class as string) === 'symbolInstance') {
        const foreignSymbol = data.document.foreignSymbols.find(
          x => x.symbolMaster.symbolID === (current as any).symbolID
        );

        if (foreignSymbol) {
          this.traverse(data, foreignSymbol.symbolMaster);
        }
      }
      if (this.textBlocGenService.identify(current)) {
        this.textBlocGenService.compute(current);
      }
      if (this.svgBlocGenService.identify(current)) {
        this.svgBlocGenService.compute(current);
      }
    }
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
}
