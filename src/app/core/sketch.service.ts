import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { WebCodeGenService } from '@xlayers/web-codegen';
import { SketchIngestorService } from '@xlayers/sketch-ingestor';

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
    private sketchIngestor: SketchIngestorService,
    private http: HttpClient,
    private webCodeGen: WebCodeGenService
  ) {}

  async loadSketchFile(file: File) {
    const data = await this.sketchIngestor.process(file);
    data.pages.forEach(page => {
      this.webCodeGen.compute(page, data);
    });
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
}
