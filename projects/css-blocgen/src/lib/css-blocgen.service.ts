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
    private cssParserService: CssParserService,
    private cssRenderService: CssRenderService
  ) {}

  transform(current: SketchMSLayer) {
    if (!this.cssContextService.hasContext(current)) {
      this.compute(current);
    }

    return this.render(current);
  }

  compute(current: SketchMSLayer) {
    this.cssParserService.compute(current);
  }

  render(current: SketchMSLayer) {
    return this.cssRenderService.render(current);
  }

  identify(current: SketchMSLayer) {
    return this.cssContextService.identify(current);
  }

  hasContext(current: SketchMSLayer) {
    return this.cssContextService.hasContext(current);
  }

  contextOf(current: SketchMSLayer) {
    return this.cssContextService.contextOf(current);
  }
}
