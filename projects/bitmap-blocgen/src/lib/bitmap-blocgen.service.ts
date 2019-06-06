import { Injectable } from '@angular/core';
import { BitmapRenderService } from './bitmap-render.service';

@Injectable({
  providedIn: 'root'
})
export class BitmapBlocGenService {
  constructor(private bitmapRenderService: BitmapRenderService) {}
  transform(current: SketchMSLayer, data?: SketchMSData) {
    return this.bitmapRenderService.render(current, data);
  }
}
