import { Injectable } from '@angular/core';
import { VueContextService } from './vue-context.service';
import { VueParserService } from './vue-parser.service';
import { VueRenderService } from './vue-render.service';

@Injectable({
  providedIn: 'root'
})
export class VueBlocGenService {
  constructor(
    private vueContextService: VueContextService,
    private vueParserService: VueParserService,
    private vueRenderService: VueRenderService
  ) {}

  transform(current: SketchMSLayer, data?: SketchMSData) {
    if (!this.vueContextService.hasContext(current)) {
      this.vueParserService.compute(data, current);
    }

    return this.vueRenderService.render(current, data);
  }
}
