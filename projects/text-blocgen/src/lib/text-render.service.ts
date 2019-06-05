import { Injectable } from "@angular/core";
import { TextContextService } from "./text-context.service";
import { TextBlocGenOptions } from "./text-blocgen.service";

@Injectable({
  providedIn: "root"
})
export class TextRenderService {
  constructor(private textContextService: TextContextService) {}

  render(
    _data: SketchMSData,
    current: SketchMSLayer,
    _opts?: TextBlocGenOptions
  ) {
    const context = this.textContextService.contextOf(current);
    return [
      {
        kind: "text",
        language: "utf8",
        value: context.content,
        uri: `${current.name}.txt`
      }
    ];
  }
}
