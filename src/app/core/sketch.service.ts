import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { CssBlocGenService } from '@xlayers/css-blocgen';
import { SketchIngestorService } from '@xlayers/sketch-ingestor';
import { SvgBlocGenService } from '@xlayers/svg-blocgen';
import { AstService, ResourceService } from '@xlayers/sketch-lib';

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
    private resourceService: ResourceService,
    private sketchIngestorService: SketchIngestorService,
    private http: HttpClient,
    private cssBlocGenService: CssBlocGenService,
    private astService: AstService,
    private svgBlocGenService: SvgBlocGenService
  ) {}

  async loadSketchFile(file: File) {
    const data = await this.sketchIngestorService.process(file);
    data.pages.forEach(page => this.traverse(data, page));
    return data;
  }

  listDemoFiles() {
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

  private traverse(data: SketchMSData, current: SketchMSLayer) {
    if (Array.isArray(current.layers)) {
      current.layers.forEach(layer => {
        this.cssBlocGenService.compute(layer);
        this.traverse(data, layer);
      });
    } else {
      if (this.resourceService.identifySymbolInstance(current)) {
        const symbolMaster = this.resourceService.lookupSymbolMaster(
          current,
          data
        );

        if (symbolMaster) {
          this.traverse(data, symbolMaster);
        }
      }
      if (this.astService.identifyText(current)) {
        this.astService.lookupText(current);
      }
      if (this.svgBlocGenService.identify(current)) {
        this.svgBlocGenService.compute(current);
      }
    }
  }
}
