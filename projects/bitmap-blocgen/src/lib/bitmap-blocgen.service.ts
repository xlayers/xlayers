import { Injectable } from "@angular/core";
import { BitmapRenderService } from "./bitmap-render.service";

export interface BitmapBlocGenOptions {}

@Injectable({
  providedIn: "root"
})
export class BitmapBlocGenService {
  constructor(private bitmapRenderService: BitmapRenderService) {}
  transform(
    data: SketchMSData,
    current: SketchMSLayer,
    options: BitmapBlocGenOptions = {}
  ) {
    return this.bitmapRenderService.render(data, current, options);
  }
}
