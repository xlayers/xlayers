import { Injectable } from '@angular/core';
import { BitmapRenderService } from './bitmap-render.service';
import { BitmapContextService } from './bitmap-context.service';

@Injectable({
  providedIn: 'root'
})
export class BitmapBlocGenService {
  constructor(
    private bitmapRenderService: BitmapRenderService,
    private bitmapContextService: BitmapContextService
  ) {}

  transform(current: SketchMSLayer, data?: SketchMSData) {
    return this.bitmapRenderService.render(current, data);
  }

  render(current: SketchMSLayer, data?: SketchMSData) {
    return this.bitmapRenderService.render(current, data);
  }

  identify(current: SketchMSLayer) {
    return this.bitmapContextService.identify(current);
  }

  hasGlobalContext(data: SketchMSData) {
    return this.bitmapContextService.hasGlobalContext(data);
  }

  globalContextOf(data: SketchMSData) {
    return this.bitmapContextService.globalContextOf(data);
  }
}
