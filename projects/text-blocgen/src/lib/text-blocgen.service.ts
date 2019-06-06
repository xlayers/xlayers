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
      this.textParserService.compute(current);
    }

    return this.textRenderService.render(current, data);
  }
}
