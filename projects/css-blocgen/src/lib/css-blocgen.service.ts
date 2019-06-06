import { Injectable } from '@angular/core';
import { CssContextService } from './css-context.service';
import { CssParserService } from './css-parser.service';
import { CssRenderService } from './css-render.service';

@Injectable({
  providedIn: 'root'
})
export class CssBlocGenService {
  constructor(
    private cssContextService: CssContextService,
    private cssComputeService: CssParserService,
    private cssRenderService: CssRenderService
  ) {}

  transform(current: SketchMSLayer, data?: SketchMSData) {
    if (!this.cssContextService.hasContext(current)) {
      this.cssComputeService.compute(current);
    }

    return this.cssRenderService.render(current, data);
  }
}
