import { Injectable } from '@angular/core';
import { TextContextService } from './text-context.service';
import { TextParserService } from './text-parser.service';
import { TextRenderService } from './text-render.service';

@Injectable({
  providedIn: 'root'
})
export class TextBlocGenService {
  constructor(
    private textContextService: TextContextService,
    private textParserService: TextParserService,
    private textRenderService: TextRenderService
  ) {}

  transform(current: SketchMSLayer, data?: SketchMSData) {
    if (!this.textContextService.hasContext(current)) {
      this.compute(current);
    }

    return this.render(current, data);
  }

  compute(current: SketchMSLayer) {
    this.textParserService.compute(current);
  }

  render(current: SketchMSLayer, data?: SketchMSData) {
    return this.textRenderService.render(current, data);
  }

  identify(current: SketchMSLayer) {
    return this.textContextService.identify(current);
  }

  hasContext(current: SketchMSLayer) {
    return this.textContextService.hasContext(current);
  }

  contextOf(current: SketchMSLayer) {
    return this.textContextService.contextOf(current);
  }
}
