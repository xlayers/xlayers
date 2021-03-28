import { Injectable } from '@angular/core';
import { Ingestor } from '@xlayers/ingestor';
@Injectable({
  providedIn: 'root',
})
export class SketchIngestorService {
  private ingestor: Ingestor;

  async process(file: File) {
    return this.getIngestor().process(file);
  }

  private getIngestor() {
    if (!this.ingestor) {
      this.ingestor = new Ingestor();
    }
    return this.ingestor;
  }
}
