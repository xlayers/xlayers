import { Injectable } from "@angular/core";
import { CssContextService } from "./css-context.service";
import { CssParserService } from "./css-parser.service";
import { CssRenderService } from "./css-render.service";
import { RuleRenderService } from "./rule-render.service";

@Injectable({
  providedIn: "root"
})
export class CssBlocGenService {
  constructor(
    private cssContextService: CssContextService,
    private cssParserService: CssParserService,
    private cssBlocGen: RuleRenderService
  ) {}

  transform(current: SketchMSLayer, options?) {
    if (!this.cssContextService.hasContext(current)) {
      this.compute(current);
    }

    return this.render(current, options);
  }

  compute(current: SketchMSLayer) {
    this.cssParserService.compute(current);
  }

  render(current: SketchMSLayer, options?) {
    return this.cssBlocGen.render(current, options);
  }

  identify(current: SketchMSLayer) {
    return this.cssContextService.identify(current);
  }

  hasContext(current: SketchMSLayer) {
    return this.cssContextService.hasContext(current);
  }

  contextOf(current: SketchMSLayer) {
    return this.cssContextService.contextOf(current);
  }
}
