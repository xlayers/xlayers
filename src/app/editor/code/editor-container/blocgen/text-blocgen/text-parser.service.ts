import { Injectable } from "@angular/core";
import { BinaryService } from "../bplist.service";
import { TextContextService } from "./text-context.service";

@Injectable({
  providedIn: "root"
})
export class TextParserService {
  constructor(
    private readonly textContextService: TextContextService,
    private readonly binaryHelperService: BinaryService
  ) {}

  compute(current: SketchMSLayer) {
    const content =
      current.attributedString.string ||
      this.extractAttributedStringText(current);

    this.textContextService.putContext(current, {
      ...this.textContextService.contextOf(current),
      content
    });
  }

  private extractAttributedStringText(current: SketchMSLayer) {
    const obj = current.attributedString;

    if (obj && obj.hasOwnProperty("archivedAttributedString")) {
      const archive = this.binaryHelperService.parse64Content(
        obj.archivedAttributedString._archive
      );

      if (archive) {
        return this.decodeRrchiveString(archive);
      }
    }

    return "";
  }

  private decodeRrchiveString(archive) {
    switch (archive.$key) {
      case "ascii":
        return archive.$value;
      default:
        return "";
    }
  }
}
