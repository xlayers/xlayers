import { Injectable } from "@angular/core";
import { CssContextService } from "./css-context.service";
import { CssParserService } from "./css-parser.service";
import { CssRenderService } from "./css-render.service";
import { CssOptimizerService } from "./css-optimizer.service";

export interface CssBlocGenOptions {
  classNamePrefix?: string;
}

@Injectable({
  providedIn: "root"
})
export class CssBlocGenService {
  constructor(
    private cssContextService: CssContextService,
    private cssComputeService: CssParserService,
    private cssRenderService: CssRenderService,
    private cssOptimizerService: CssOptimizerService
  ) {}

  transform(
    data: SketchMSData,
    current: SketchMSLayer,
    options: CssBlocGenOptions = {}
  ) {
    if (!this.cssContextService.hasContext(current)) {
      this.cssComputeService.compute(current, options);
      this.cssOptimizerService.parseStyleSheet(current);
    }

    return this.cssRenderService.render(data, current, options);
  }
}
