import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UiState } from "@app/core/state";
import { environment } from "@env/environment";
import { Store } from "@ngxs/store";
import { CssParserService, CssContextService } from "@xlayers/css-blocgen";
import { SketchIngestorService } from "@xlayers/sketch-blocgen";
import { SvgParserService, SvgContextService } from "@xlayers/svg-blocgen";
import { TextParserService } from "../../../projects/text-blocgen/src/lib/text-parser.service";
import { TextContextService } from "@xlayers/text-blocgen";

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
  providedIn: "root"
})
export class SketchService {
  _data: SketchMSData;

  constructor(
    private sketchIngestorService: SketchIngestorService,
    private http: HttpClient,
    private cssParserService: CssParserService,
    private svgParserService: SvgParserService,
    private textParserService: TextParserService,
    private svgContextService: SvgContextService,
    private textContextService: TextContextService,
    private store: Store
  ) {
    this.store.select(UiState.currentData).subscribe(currentData => {
      this._data = currentData as SketchMSData;
    });
  }

  async process(file: File) {
    const data = await this.sketchIngestorService.process(file);
    (data.pages as any).forEach(page => this.traverse(data, page));
    return data;
  }

  private traverse(data: SketchMSData, current: SketchMSLayer) {
    if (Array.isArray(current.layers)) {
      current.layers.forEach(layer => {
        this.cssParserService.compute(layer);
        this.traverse(data, layer);
      });
    } else {
      if ((current._class as string) === "symbolInstance") {
        const foreignSymbol = data.document.foreignSymbols.find(
          x => x.symbolMaster.symbolID === (current as any).symbolID
        );

        if (foreignSymbol) {
          this.traverse(data, foreignSymbol.symbolMaster);
        }
      }
      if (this.textContextService.identify(current)) {
        this.textParserService.compute(current);
      }
      if (this.svgContextService.identify(current)) {
        this.svgParserService.compute(current);
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
      responseType: "blob"
    });
  }

  getImageDataFromRef(ref: string) {
    return this._data.resources.images[ref];
  }
}
