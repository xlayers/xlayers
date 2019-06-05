import { Injectable } from "@angular/core";

export interface OpenTagOptions {
  autoclose?: boolean;
}

@Injectable({
  providedIn: "root"
})
export class XmlService {
  openTag(
    tag = "div",
    attributes: string[] = [],
    opts: OpenTagOptions = {}
  ) {
    const attributeStr =
      attributes.length !== 0 ? " " + attributes.join(" ") : "";
    const autocloseStr = opts.autoclose ? " /" : "";
    return `<${tag}${attributeStr}${autocloseStr}>`;
  }

  closeTag(tag = "div") {
    return `</${tag}>`;
  }
}
