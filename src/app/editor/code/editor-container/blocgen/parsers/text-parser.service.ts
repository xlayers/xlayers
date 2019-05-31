import { Injectable } from "@angular/core";
import { RessourceFile, ParserFacade, WithLocalContext } from "../blocgen";
import { ShapeHelperService } from "../shape-helper.service";
import { StyleHelperService } from "../style-helper.service";
import { FormatHelperService } from "../format-helper.service";
import { BinaryHelperService } from "../bplist-helper.service";

export interface TextParserOptions {}

export interface TextParserContext {
  paths: string;
  offset: number;
}

@Injectable({
  providedIn: "root"
})
export class TextParserService
  implements ParserFacade, WithLocalContext<TextParserContext> {
  constructor(private readonly binaryHelperService: BinaryHelperService) {}
  transform(
    _data: SketchMSData,
    current: SketchMSLayer,
    _options?: TextParserOptions
  ) {
    if (!this.hasContext(current)) {
      this.compute(current);
    }

    return [this.renderTextRessourceFile(current)];
  }

  identify(current: SketchMSLayer) {
    return ["shapePath", "shapeGroup"].includes(current._class as string);
  }

  hasContext(current: SketchMSLayer) {
    return !!this.contextOf(current);
  }

  contextOf(current: SketchMSLayer) {
    return (current as any).text;
  }

  compute(current: SketchMSLayer) {
    (current as any).text = {
      content:
        current.attributedString.string ||
        this.extractAttributedStringText(current)
    };
  }

  private extractAttributedStringText(current: SketchMSLayer) {
    const obj = current.attributedString;

    if (!obj || !obj.hasOwnProperty("archivedAttributedString")) {
      return "";
    }

    const archive = this.binaryHelperService.parse64Content(
      obj.archivedAttributedString._archive
    );

    if (!archive) {
      return "";
    }

    switch (archive.$key) {
      case "ascii":
        return archive.$value;
      default:
        return "";
    }
  }
  private renderTextRessourceFile(current: SketchMSLayer) {
    const context = this.contextOf(current);

    return {
      kind: "text",
      language: "utf8",
      value: context.content,
      uri: `${current.name}.txt`
    };
  }
}
