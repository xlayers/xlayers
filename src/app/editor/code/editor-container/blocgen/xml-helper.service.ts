import { Injectable } from "@angular/core";

export interface OpenTagOptions {
  autoclose?: boolean;
}

@Injectable({
  providedIn: "root"
})
export class XmlHelperService {
  openTag(
    tag = "div",
    attributes: string[] = [],
    options: OpenTagOptions = {}
  ) {
    const attributeStr =
      attributes.length !== 0 ? " " + attributes.join(" ") : "";
    const autocloseStr = options.autoclose ? " /" : "";
    return `<${tag}${attributeStr}${autocloseStr}>`;
  }

  closeTag(tag = "div") {
    return `</${tag}>`;
  }
}
