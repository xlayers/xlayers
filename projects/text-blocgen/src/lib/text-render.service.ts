import { Injectable } from '@angular/core';
import { TextContextService } from './text-context.service';

@Injectable({
  providedIn: 'root'
})
export class TextRenderService {
  constructor(private textContextService: TextContextService) {}

  render(current: SketchMSLayer, _data?: SketchMSData) {
    const context = this.textContextService.contextOf(current);
    return [
      {
        kind: 'text',
        language: 'utf8',
        value: context.content,
        uri: `${current.name}.txt`
      }
    ];
  }
}
