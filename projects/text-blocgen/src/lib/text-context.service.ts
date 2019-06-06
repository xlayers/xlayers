import { Injectable } from '@angular/core';

export interface TextParserContext {
  paths: string;
  offset: number;
}

@Injectable({
  providedIn: 'root'
})
export class TextContextService {
  identify(current: SketchMSLayer) {
    return ['text'].includes(current._class as string);
  }

  hasContext(current: SketchMSLayer) {
    return !!this.contextOf(current);
  }

  contextOf(current: SketchMSLayer) {
    return (current as any).text;
  }

  putContext(current: SketchMSLayer, context: TextParserContext) {
    (current as any).text = context;
  }
}
