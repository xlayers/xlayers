import { Injectable } from '@angular/core';
import { ImageService, LayerService, TextService } from '@xlayers/sketch-lib';
import { SvgCodeGenService } from '@xlayers/svg-codegen';

@Injectable({
  providedIn: 'root'
})
export class WebContextService {
  constructor(
    private readonly layerService: LayerService,
    private readonly textService: TextService,
    private readonly imageService: ImageService,
    private readonly svgCodeGen: SvgCodeGenService
  ) {}

  identify(current: SketchMSLayer) {
    return (
      this.imageService.identify(current) ||
      this.textService.identify(current) ||
      this.layerService.identify(current) ||
      this.svgCodeGen.identify(current) ||
      [
        'oval',
        'rect',
        'rectangle',
        'group',
        'symbolMaster',
        'shapeGroup'
      ].includes(current._class)
    );
  }

  of(current: SketchMSLayer): XLayersWebCodeGenContext {
    return current.web;
  }

  put(current: SketchMSLayer, nextContext: XLayersWebCodeGenContext): void {
    current.web = {
      ...this.of(current),
      ...nextContext,
      tag: {
        name: '',
        empty: false
      }
    };
  }

  clear(current: SketchMSLayer): void {
    delete current.web;
  }
}
