import { Injectable } from "@angular/core";
import { CssContextService } from "./css-context.service";
import { CssParserService } from "./css-parser.service";
import { CssRenderService } from "./css-render.service";

@Injectable({
  providedIn: "root"
})
export class CssBlocGenService {
  constructor(
    private cssContext: CssContextService,
    private cssParser: CssParserService,
    private cssRender: CssRenderService
  ) {}

  transform(current: SketchMSLayer) {
    if (!this.cssContext.hasContext(current)) {
      this.compute(current);
    }

    return this.render(current);
  }

  compute(current: SketchMSLayer) {
    this.cssParser.compute(current);
  }

  render(current: SketchMSLayer) {
    return this.cssRender.render(current);
  }

  identify(current: SketchMSLayer) {
    return this.cssContext.identify(current);
  }

  hasContext(current: SketchMSLayer) {
    return this.cssContext.hasContext(current);
  }

  contextOf(current: SketchMSLayer) {
    return this.cssContext.contextOf(current);
  }
}
