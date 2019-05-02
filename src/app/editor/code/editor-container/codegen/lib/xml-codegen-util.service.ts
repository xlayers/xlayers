import { Injectable } from "@angular/core";

/**
 * @see CodeGenVisitor implementation that can be used to generate code in an XML-based representation.
 */
@Injectable({
  providedIn: "root"
})
export class XmlCodegenUtilService {
  private readonly indentationSymbol = "  "; // 2 spaces ftw

  tag(tag: string, attr: string[] = [], content: string = "") {
    const autoclose = content.length === 0;
    return this.openTag(tag, attr, autoclose) + autoclose
      ? ""
      : this.closeTag(tag);
  }

  openTag(tag: string, attributes: string[] = [], autoclose = false): string {
    return `<${tag}${
      attributes.length !== 0 ? " " + attributes.join(" ") : ""
    }${autoclose ? " /" : ""}>`;
  }

  closeTag(tag: string): string {
    return `</${tag}>`;
  }

  indent(n: number, content: string): string {
    const indentation = !!n ? this.indentationSymbol.repeat(n) : "";
    return indentation + content.split("\n").join("\n" + indentation);
  }
}
