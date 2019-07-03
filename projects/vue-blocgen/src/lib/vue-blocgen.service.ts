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
      this.compute(data, current);
    }

    return this.render(current, data);
  }

  compute(data: SketchMSData, current: SketchMSLayer) {
    this.vueParserService.compute(data, current);
  }

  render(current: SketchMSLayer, data?: SketchMSData) {
    return this.vueRenderService.render(current, data);
  }

  identify(current: SketchMSLayer) {
    return this.vueContextService.identify(current);
  }

  hasContext(current: SketchMSLayer) {
    return this.vueContextService.hasContext(current);
  }

  contextOf(current: SketchMSLayer) {
    return this.vueContextService.contextOf(current);
  }
}
